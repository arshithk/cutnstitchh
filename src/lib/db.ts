import mongoose from "mongoose";
import mongodbPackage from "mongodb/package.json";
import { env } from "./env";

interface MongooseGlobalCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = global as typeof globalThis & {
  mongooseCache?: MongooseGlobalCache;
};

if (!globalWithMongoose.mongooseCache) {
  globalWithMongoose.mongooseCache = { conn: null, promise: null };
}

export async function dbConnect() {
  if (globalWithMongoose.mongooseCache?.conn) {
    return globalWithMongoose.mongooseCache.conn;
  }

  if (!globalWithMongoose.mongooseCache) {
    globalWithMongoose.mongooseCache = { conn: null, promise: null };
  }

  if (!globalWithMongoose.mongooseCache.promise) {
    const uri = env.MONGODB_URI;
    const host = (() => {
      try {
        const normalized = uri.replace(/^mongodb\+srv:\/\//, "https://");
        return new URL(normalized).host;
      } catch {
        return "unknown";
      }
    })();

    console.log("dbConnect: process.version", process.version);
    console.log("dbConnect: mongoose.version", mongoose.version);
    console.log("dbConnect: mongodb driver version", mongodbPackage.version);
    console.log("dbConnect: NODE_ENV", process.env.NODE_ENV);
    console.log("dbConnect: MONGODB_URI exists", Boolean(uri));
    console.log("dbConnect: MongoDB host", host);

    globalWithMongoose.mongooseCache.promise = mongoose
      .connect(uri)
      .then((mongooseInstance) => mongooseInstance)
      .catch((error) => {
        globalWithMongoose.mongooseCache = { conn: null, promise: null };
        console.error("dbConnect failed:", {
          name: (error as any)?.name,
          message: (error as any)?.message,
          code: (error as any)?.code,
          stack: (error as any)?.stack,
          cause: (error as any)?.cause,
        });
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
