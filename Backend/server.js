// server.js
import "dotenv/config";
import http from "http";
import path from "path";
import fs from "fs";
import app from "./app.js";
import { connectAll, gracefulShutdown } from "./config/db.js";

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const MONGO_DB = process.env.MONGO_DB || "taxpal";

async function start() {
  try {
    await connectAll({ uri: MONGO_URI, dbName: MONGO_DB });
    console.log("✅ Connected to MongoDB (Mongoose + Native client)");
  } catch (err) {
    console.error("❌ DB connection failed at startup:", err.message || err);
    // Continue starting server even if DB connection failed for dev/debug convenience
  }

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT} (env: ${process.env.NODE_ENV || "dev"})`);
  });

  let shuttingDown = false;
  async function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`\n${signal} received — shutting down gracefully...`);

    server.close(async (err) => {
      if (err) console.error("Error closing HTTP server:", err);
      try {
        await gracefulShutdown();
        console.log("✅ DB connections closed.");
      } catch (e) {
        console.error("Error during DB gracefulShutdown:", e);
      }
      console.log("Shutdown complete.");
      process.exit(0);
    });

    setTimeout(() => {
      console.error("Forcing shutdown after timeout.");
      process.exit(1);
    }, 10000).unref();
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  process.on("uncaughtException", (err) => {
    console.error("uncaughtException:", err);
    shutdown("uncaughtException");
  });
  process.on("unhandledRejection", (reason) => {
    console.error("unhandledRejection:", reason);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
