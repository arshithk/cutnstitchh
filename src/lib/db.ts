import mongoose from "mongoose";
import { getMongoUri } from "./env";

interface MongooseGlobalCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseGlobalCache | undefined;
}

let cached: MongooseGlobalCache = global.mongooseCache || { conn: null, promise: null };
if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

function getMongoOptions(uri: string): mongoose.ConnectOptions {
  const isSrv = uri.startsWith("mongodb+srv://");
  const isLocal = uri.includes("127.0.0.1") || uri.includes("localhost");

  const opts: mongoose.ConnectOptions = {
    // 10s server selection gives Atlas SRV & TLS cold start enough time on Vercel lambdas
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    // Keep pool size small for serverless to prevent Atlas connection exhaustion
    maxPoolSize: 10,
    minPoolSize: 0,
    autoIndex: process.env.NODE_ENV !== "production",
    bufferCommands: false,
  };

  // Only force IPv4 on local standalone to prevent localhost IPv6 delay
  if (isLocal && !isSrv) {
    opts.family = 4;
  }

  // Preserve directConnection only if explicitly present in URI
  if (uri.includes("directConnection=true")) {
    opts.directConnection = true;
  }

  return opts;
}

export async function dbConnect(retries = 3): Promise<typeof mongoose> {
  // If already connected and ready, reuse connection immediately
  if ((mongoose.connection.readyState as number) === 1) {
    cached.conn = mongoose;
    return mongoose;
  }

  // If connection is in progress, await the ongoing promise
  if (cached.promise && (mongoose.connection.readyState as number) === 2) {
    try {
      const conn = await cached.promise;
      if ((mongoose.connection.readyState as number) === 1) {
        cached.conn = conn;
        return conn;
      }
    } catch {
      // If previous promise rejected, reset and proceed with fresh attempt
      cached.conn = null;
      cached.promise = null;
    }
  }

  const uri = getMongoUri();
  const options = getMongoOptions(uri);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      cached.promise = mongoose.connect(uri, options);
      const conn = await cached.promise;

      if ((mongoose.connection.readyState as number) === 1) {
        cached.conn = conn;
        return conn;
      }
    } catch (error) {
      cached.conn = null;
      cached.promise = null;
      const errMsg = (error as any)?.message || String(error);
      console.warn(`[MongoDB] Connection attempt ${attempt}/${retries} failed:`, errMsg);

      if (attempt < retries) {
        // Exponential backoff: 300ms, 600ms
        await new Promise((resolve) => setTimeout(resolve, attempt * 300));
      } else {
        if (
          errMsg.includes("ECONNREFUSED") ||
          errMsg.includes("Server selection timed out") ||
          errMsg.includes("HostUnreachable") ||
          errMsg.includes("ENOTFOUND")
        ) {
          const isLocal = uri.includes("127.0.0.1") || uri.includes("localhost");
          if (isLocal) {
            throw new Error(
              "Cannot connect to local MongoDB server at 127.0.0.1:27017. Please ensure MongoDB service is running, or set MONGODB_URI to your cloud MongoDB Atlas database."
            );
          } else {
            throw new Error(
              "Cannot connect to MongoDB Atlas cluster. Please check that MONGODB_URI is correctly configured in Vercel, and that MongoDB Atlas Network Access allows connections (IP Whitelist is set to 0.0.0.0/0 for Vercel)."
            );
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
        console.warn(`[MongoDB] Transient DB error on attempt ${attempt}, reconnecting and retrying:`, msg);
        cached.conn = null;
        cached.promise = null;
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
  if (!cached.conn) {
    return;
  }
  await mongoose.disconnect();
  cached.conn = null;
  cached.promise = null;
}
