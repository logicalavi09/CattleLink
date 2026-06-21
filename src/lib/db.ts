import mongoose from "mongoose";

const rawUri = process.env.MONGODB_URI;
const MONGODB_URI = rawUri?.trim();

if (!MONGODB_URI) {
  throw new Error("Error: MONGODB_URI is not defined in environment variables. Check your .env.local file.");
}

interface MongooseGlobal {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseGlobal: MongooseGlobal | undefined;
}

let cached = global.mongooseGlobal as MongooseGlobal;

if (!cached) {
  cached = { conn: null, promise: null };
  global.mongooseGlobal = cached;
}

export async function connectDB() {
  console.log("Connecting to:", process.env.MONGODB_URI ? "URI found" : "URI MISSING");

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export function getConnectionError(): string | null {
  try {
    if (!process.env.MONGODB_URI?.trim()) {
      return "Database connection string is missing. Please check your .env.local file.";
    }
    return null;
  } catch {
    return "Failed to read database configuration.";
  }
}
