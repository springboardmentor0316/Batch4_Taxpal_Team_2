// config/db.js (ESM)
import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const MONGO_DB = process.env.MONGO_DB || "taxpal";

let _mongooseConnected = false;
let nativeClient = null;
let nativeDB = null;

export const connectDB = async (uri = MONGO_URI, options = {}) => {
  if (_mongooseConnected || mongoose.connection.readyState === 1) {
    console.log("✅ Mongoose already connected.");
    return mongoose;
  }
  try {
    const conn = await mongoose.connect(uri, { ...options, dbName: MONGO_DB });
    _mongooseConnected = true;
    console.log(`✅ Mongoose connected: ${conn.connection.host}/${conn.connection.name}`);
    return mongoose;
  } catch (error) {
    console.error("❌ Mongoose connection error:", error);
    throw error;
  }
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.disconnect();
      _mongooseConnected = false;
      console.log("🛑 Mongoose disconnected.");
    } catch (err) {
      console.error("Error disconnecting mongoose:", err);
      throw err;
    }
  }
};

export async function connectNative(uri = MONGO_URI, dbName = MONGO_DB, clientOptions = {}) {
  if (nativeDB) return nativeDB;
  if (!nativeClient) nativeClient = new MongoClient(uri, { ...clientOptions });
  try {
    await nativeClient.connect();
    nativeDB = nativeClient.db(dbName);
    console.log(`✅ Native MongoDB connected: ${uri} -> DB: ${dbName}`);
    return nativeDB;
  } catch (err) {
    console.error("❌ Native MongoDB connection error:", err);
    try { if (nativeClient) await nativeClient.close(); } catch (_) {}
    nativeClient = null;
    nativeDB = null;
    throw err;
  }
}

export function getNativeDb() {
  if (!nativeDB) throw new Error("Native MongoDB not connected. Call connectNative() first.");
  return nativeDB;
}

export function getClient() {
  return nativeClient;
}

export async function closeNative() {
  if (nativeClient) {
    try {
      await nativeClient.close();
      nativeClient = null;
      nativeDB = null;
      console.log("🛑 Native MongoDB connection closed.");
    } catch (err) {
      console.error("Error closing native MongoDB client:", err);
      throw err;
    }
  }
}

export async function connectAll({ uri = MONGO_URI, dbName = MONGO_DB, mongooseOptions = {}, nativeOptions = {} } = {}) {
  const mongoosePromise = connectDB(uri, mongooseOptions);
  const nativePromise = connectNative(uri, dbName, nativeOptions);
  const [m, nativeDb] = await Promise.all([mongoosePromise, nativePromise]);
  return { mongoose: m, nativeDb };
}

export async function gracefulShutdown() {
  const results = await Promise.allSettled([disconnectDB(), closeNative()]);
  for (const r of results) {
    if (r.status === "rejected") console.error("Error during graceful shutdown:", r.reason);
  }
}

export default {
  connectDB,
  disconnectDB,
  connectNative,
  getNativeDb,
  getClient,
  closeNative,
  connectAll,
  gracefulShutdown,
};
