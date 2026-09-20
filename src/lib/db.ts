import mongoose from "mongoose";
import { env } from "./env";

interface MongooseGlobalCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastFailed?: number;
  heartbeatTimer?: NodeJS.Timeout;
}

const globalWithMongoose = global as typeof globalThis & {
  mongooseCache?: MongooseGlobalCache;
  hasAttachedMongoListeners?: boolean;
};

if (!globalWithMongoose.mongooseCache) {
  globalWithMongoose.mongooseCache = { conn: null, promise: null, lastFailed: 0 };
}

const MONGO_OPTIONS: mongoose.ConnectOptions = {
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4, // Force IPv4 (127.0.0.1) to avoid Windows IPv6 resolution latency
  maxPoolSize: 20, // Sufficient connection pool
  minPoolSize: 2, // Always keep at least 2 warm connections alive
  maxIdleTimeMS: 30000, // Recycle idle sockets before OS disconnects them
  heartbeatFrequencyMS: 5000, // MongoDB driver background heartbeat
  directConnection: true, // Direct connection to local standalone MongoDB
  autoIndex: true,
};

function startKeepAliveHeartbeat() {
  if (globalWithMongoose.mongooseCache?.heartbeatTimer) return;

  // Background ping every 10 seconds to keep connection alive and auto-recover
  const timer = setInterval(async () => {
    try {
      const state = mongoose.connection.readyState;
      if (state === 1) {
        // Ping database to keep socket warm
        if (mongoose.connection.db) {
          await mongoose.connection.db.command({ ping: 1 });
        }
      } else if (state === 0 || state === 3) {
        // Disconnected or disconnecting - trigger background reconnect
        void dbConnect(2).catch(() => {});
      }
    } catch {
      // Invalidate cached connection on ping failure so next call re-establishes cleanly
      if (globalWithMongoose.mongooseCache) {
        globalWithMongoose.mongooseCache.conn = null;
        globalWithMongoose.mongooseCache.promise = null;
      }
    }
  }, 10000);

  // Allow Node process to exit cleanly if needed
  if (timer.unref) {
    timer.unref();
  }

  if (globalWithMongoose.mongooseCache) {
    globalWithMongoose.mongooseCache.heartbeatTimer = timer;
  }
}

function attachConnectionListeners() {
  if (globalWithMongoose.hasAttachedMongoListeners) return;
  globalWithMongoose.hasAttachedMongoListeners = true;

  mongoose.connection.on("connected", () => {
    if (globalWithMongoose.mongooseCache) {
      globalWithMongoose.mongooseCache.lastFailed = 0;
    }
    startKeepAliveHeartbeat();
  });

  mongoose.connection.on("disconnected", () => {
    if (globalWithMongoose.mongooseCache) {
      globalWithMongoose.mongooseCache.conn = null;
      globalWithMongoose.mongooseCache.promise = null;
    }
    // Proactively reconnect in background
    setTimeout(() => {
      void dbConnect(2).catch(() => {});
    }, 500);
  });

  mongoose.connection.on("error", (err) => {
    console.warn("MongoDB connection event notice:", (err as Error)?.message || err);
    if (globalWithMongoose.mongooseCache) {
      globalWithMongoose.mongooseCache.conn = null;
      globalWithMongoose.mongooseCache.promise = null;
    }
  });

  startKeepAliveHeartbeat();
}

export async function dbConnect(retries = 4): Promise<typeof mongoose> {
  attachConnectionListeners();

  // If already connected and ready, return immediately
  if (globalWithMongoose.mongooseCache?.conn && (mongoose.connection.readyState as number) === 1) {
    return globalWithMongoose.mongooseCache.conn;
  }

  // If connection is in progress, await it
  if (globalWithMongoose.mongooseCache?.promise && (mongoose.connection.readyState as number) === 2) {
    try {
      const conn = await globalWithMongoose.mongooseCache.promise;
      if ((mongoose.connection.readyState as number) === 1) {
        return conn;
      }
    } catch {
      // If previous promise rejected, reset and proceed with fresh attempt
    }
  }

  const uri = env.MONGODB_URI;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (!globalWithMongoose.mongooseCache) {
        globalWithMongoose.mongooseCache = { conn: null, promise: null, lastFailed: 0 };
      }

      globalWithMongoose.mongooseCache.promise = mongoose.connect(uri, MONGO_OPTIONS);
      const conn = await globalWithMongoose.mongooseCache.promise;

      globalWithMongoose.mongooseCache.conn = conn;
      globalWithMongoose.mongooseCache.lastFailed = 0;
      return conn;
    } catch (error) {
      const errMsg = (error as any)?.message || String(error);
      if (globalWithMongoose.mongooseCache) {
        globalWithMongoose.mongooseCache.conn = null;
        globalWithMongoose.mongooseCache.promise = null;
        globalWithMongoose.mongooseCache.lastFailed = Date.now();
      }

      console.warn(`dbConnect attempt ${attempt}/${retries} failed:`, errMsg);

      if (attempt < retries) {
        // Exponential backoff: 300ms, 600ms, 1200ms
        await new Promise((resolve) => setTimeout(resolve, attempt * 300));
      } else {
        if (errMsg.includes("ECONNREFUSED") || errMsg.includes("Server selection timed out") || errMsg.includes("HostUnreachable")) {
          throw new Error("Cannot connect to MongoDB server at 127.0.0.1:27017. Please ensure the MongoDB service is running.");
        }
        throw error;
      }
    }
  }

  throw new Error("Unable to establish MongoDB connection after multiple attempts.");
}

/**
 * Executes a database operation with automatic self-healing retry.
 * If the connection was dropped or socket was reset, it reconnects and retries.
 */
export async function withDbRetry<T>(operation: () => Promise<T>, maxRetries = 2): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await dbConnect();
      return await operation();
    } catch (err: any) {
      lastError = err;
      const msg = err?.message || String(err);
      const isTransient =
        msg.includes("ECONNRESET") ||
        msg.includes("ECONNREFUSED") ||
        msg.includes("Connection reset") ||
        msg.includes("HostUnreachable") ||
        msg.includes("Server selection timed out") ||
        msg.includes("buffering timed out") ||
        msg.includes("topology was destroyed") ||
        msg.includes("connection closed");

      if (isTransient && attempt < maxRetries) {
        console.warn(`Transient DB error on attempt ${attempt}, reconnecting and retrying:`, msg);
        if (globalWithMongoose.mongooseCache) {
          globalWithMongoose.mongooseCache.conn = null;
          globalWithMongoose.mongooseCache.promise = null;
        }
        await new Promise((resolve) => setTimeout(resolve, 400));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

export async function isDbConnected(): Promise<boolean> {
  if ((mongoose.connection.readyState as number) === 1) {
    return true;
  }
  try {
    const conn = await dbConnect(1);
    return (conn.connection.readyState as number) === 1;
  } catch {
    return false;
  }
}

export async function dbDisconnect() {
  if (globalWithMongoose.mongooseCache?.heartbeatTimer) {
    clearInterval(globalWithMongoose.mongooseCache.heartbeatTimer);
    globalWithMongoose.mongooseCache.heartbeatTimer = undefined;
  }

  if (!globalWithMongoose.mongooseCache?.conn) {
    return;
  }

  await mongoose.disconnect();
  globalWithMongoose.mongooseCache = { conn: null, promise: null, lastFailed: 0 };
}

// Proactive bootstrap connection in background on module load
void dbConnect(2).catch(() => {});
