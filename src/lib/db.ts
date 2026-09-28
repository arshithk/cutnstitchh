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

function getMongoOptions(uri: string): mongoose.ConnectOptions {
  const isSrv = uri.startsWith("mongodb+srv://");
  const isLocal = uri.includes("127.0.0.1") || uri.includes("localhost");

  const opts: mongoose.ConnectOptions = {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 15,
    minPoolSize: 0,
    autoIndex: process.env.NODE_ENV !== "production",
  };

  // Only force IPv4 on local Windows standalone to prevent localhost IPv6 resolution delay
  if (isLocal && !isSrv) {
    opts.family = 4;
  }

  // CRITICAL: NEVER set directConnection: true for MongoDB Atlas (mongodb+srv://) or replica sets!
  // directConnection: true forces connection to a single node, which is often a read-only secondary
  // that rejects insertOne/write operations, causing 'buffering timed out after 10000ms'.
  if (uri.includes("directConnection=true")) {
    opts.directConnection = true;
  }

  return opts;
}

function startKeepAliveHeartbeat() {
  // Do NOT run background timers in serverless environments (e.g. Vercel, AWS Lambda)
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return;
  }

  if (globalWithMongoose.mongooseCache?.heartbeatTimer) return;

  // Background ping every 15 seconds to keep connection alive and auto-recover
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
  }, 15000);

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
    // Only auto-reconnect in persistent environments, not serverless
    if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
      setTimeout(() => {
        void dbConnect(2).catch(() => {});
      }, 500);
    }
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

export async function dbConnect(retries = 3): Promise<typeof mongoose> {
  attachConnectionListeners();

  // If already connected and ready, return immediately
  if ((mongoose.connection.readyState as number) === 1) {
    if (globalWithMongoose.mongooseCache) {
      globalWithMongoose.mongooseCache.conn = mongoose;
    }
    return mongoose;
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
      if (globalWithMongoose.mongooseCache) {
        globalWithMongoose.mongooseCache.conn = null;
        globalWithMongoose.mongooseCache.promise = null;
      }
    }
  }

  const uri = env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured in environment variables.");
  }

  const options = getMongoOptions(uri);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (!globalWithMongoose.mongooseCache) {
        globalWithMongoose.mongooseCache = { conn: null, promise: null, lastFailed: 0 };
      }

      globalWithMongoose.mongooseCache.promise = mongoose.connect(uri, options);
      const conn = await globalWithMongoose.mongooseCache.promise;

      if ((mongoose.connection.readyState as number) === 1) {
        globalWithMongoose.mongooseCache.conn = conn;
        globalWithMongoose.mongooseCache.lastFailed = 0;
        return conn;
      }
    } catch (error) {
      const errMsg = (error as any)?.message || String(error);
      if (globalWithMongoose.mongooseCache) {
        globalWithMongoose.mongooseCache.conn = null;
        globalWithMongoose.mongooseCache.promise = null;
        globalWithMongoose.mongooseCache.lastFailed = Date.now();
      }

      console.warn(`dbConnect attempt ${attempt}/${retries} failed:`, errMsg);

      if (attempt < retries) {
        // Exponential backoff: 300ms, 600ms
        await new Promise((resolve) => setTimeout(resolve, attempt * 300));
      } else {
        if (errMsg.includes("ECONNREFUSED") || errMsg.includes("Server selection timed out") || errMsg.includes("HostUnreachable")) {
          const isLocal = uri.includes("127.0.0.1") || uri.includes("localhost");
          if (isLocal) {
            throw new Error("Cannot connect to local MongoDB server at 127.0.0.1:27017. Please ensure MongoDB service is running, or set MONGODB_URI to your cloud database.");
          } else {
            throw new Error("Cannot connect to remote MongoDB cluster. Please check MONGODB_URI and Network Access / IP Whitelist settings in MongoDB Atlas.");
          }
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
        msg.includes("connection closed") ||
        msg.includes("not connected") ||
        msg.includes("pool is closed");

      if (isTransient && attempt < maxRetries) {
        console.warn(`Transient DB error on attempt ${attempt}, reconnecting and retrying:`, msg);
        if (globalWithMongoose.mongooseCache) {
          globalWithMongoose.mongooseCache.conn = null;
          globalWithMongoose.mongooseCache.promise = null;
        }
        try {
          await mongoose.disconnect();
        } catch {
          // ignore disconnect error
        }
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
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

