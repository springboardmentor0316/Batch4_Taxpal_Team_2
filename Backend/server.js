import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // ✅ replaces bodyParser.json()

// MongoDB Connection (clean)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    console.log(`📦 Using database: ${mongoose.connection.name}`);
  })
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "TaxPal API is running" });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
