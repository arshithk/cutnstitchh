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
  if (globalWithMongoose.mongooseCache?.conn) {
    return globalWithMongoose.mongooseCache.conn;
  }

  if (!globalWithMongoose.mongooseCache) {
    globalWithMongoose.mongooseCache = { conn: null, promise: null, lastFailed: 0 };
  }

  // If connection failed within the last 30 seconds, avoid hanging or spamming
  if (
    globalWithMongoose.mongooseCache.lastFailed &&
    Date.now() - globalWithMongoose.mongooseCache.lastFailed < 30000
  ) {
    throw new Error("MongoDB connection in cooldown after recent failure");
  }

  if (!globalWithMongoose.mongooseCache.promise) {
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
        console.warn("dbConnect warning:", (error as any)?.message || error);
        throw error;
      });
  }

  globalWithMongoose.mongooseCache.conn = await globalWithMongoose.mongooseCache.promise;
  return globalWithMongoose.mongooseCache.conn;
}

export async function dbDisconnect() {
  if (!globalWithMongoose.mongooseCache?.conn) {
    return;
  }

  await mongoose.disconnect();
  globalWithMongoose.mongooseCache = { conn: null, promise: null };
}
