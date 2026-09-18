import mongoose from "mongoose";
import mongodbPackage from "mongodb/package.json";
import { env } from "./env";

interface MongooseGlobalCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastFailed?: number;
}

const globalWithMongoose = global as typeof globalThis & {
  mongooseCache?: MongooseGlobalCache;
};

if (!globalWithMongoose.mongooseCache) {
  globalWithMongoose.mongooseCache = { conn: null, promise: null, lastFailed: 0 };
}

export async function dbConnect() {
  if (globalWithMongoose.mongooseCache?.conn && (mongoose.connection.readyState as number) === 1) {
    return globalWithMongoose.mongooseCache.conn;
  }

  if (!globalWithMongoose.mongooseCache) {
    globalWithMongoose.mongooseCache = { conn: null, promise: null, lastFailed: 0 };
  }

  // If connection failed within the last 3 seconds, avoid rapid spamming
  if (
    globalWithMongoose.mongooseCache.lastFailed &&
    Date.now() - globalWithMongoose.mongooseCache.lastFailed < 3000
  ) {
    throw new Error("MongoDB service is currently unavailable. Retrying shortly...");
  }

  if (!globalWithMongoose.mongooseCache.promise || (mongoose.connection.readyState as number) === 0) {
    const uri = env.MONGODB_URI;

    globalWithMongoose.mongooseCache.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000,
      })
      .then((mongooseInstance) => {
        if (globalWithMongoose.mongooseCache) {
          globalWithMongoose.mongooseCache.lastFailed = 0;
        }
        return mongooseInstance;
      })
      .catch((error) => {
        if (globalWithMongoose.mongooseCache) {
          globalWithMongoose.mongooseCache.conn = null;
          globalWithMongoose.mongooseCache.promise = null;
          globalWithMongoose.mongooseCache.lastFailed = Date.now();
        }
        const errMsg = (error as any)?.message || String(error);
        console.warn("dbConnect warning:", errMsg);
        if (errMsg.includes("ECONNREFUSED")) {
          throw new Error("Cannot connect to MongoDB server at 127.0.0.1:27017. Please ensure the MongoDB service is running.");
        }
        throw error;
      });
  }

  try {
    globalWithMongoose.mongooseCache.conn = await globalWithMongoose.mongooseCache.promise;
    return globalWithMongoose.mongooseCache.conn;
  } catch (err) {
    if (globalWithMongoose.mongooseCache) {
      globalWithMongoose.mongooseCache.conn = null;
      globalWithMongoose.mongooseCache.promise = null;
    }
    throw err;
  }
}

export async function isDbConnected(): Promise<boolean> {
  if ((mongoose.connection.readyState as number) === 1) {
    return true;
  }
  try {
    const conn = await dbConnect();
    return (conn.connection.readyState as number) === 1;
  } catch {
    return false;
  }
}

export async function dbDisconnect() {
  if (!globalWithMongoose.mongooseCache?.conn) {
    return;
  }

  await mongoose.disconnect();
  globalWithMongoose.mongooseCache = { conn: null, promise: null, lastFailed: 0 };
}

