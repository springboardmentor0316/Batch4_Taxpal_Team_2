// app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import taxEstimatorRoutes from "./routes/taxestimatorroutes.js";
import taxCalendarRoutes from "./routes/taxcalendarroutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      const bodyPreview = JSON.stringify(req.body).slice(0, 1000);
      console.debug(`>>> BODY: ${req.method} ${req.path} - ${bodyPreview}`);
    }
    next();
  });
}

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tax", taxEstimatorRoutes);
app.use("/api/taxPayment", taxCalendarRoutes);
app.use("/api/reports", reportsRoutes);

app.get("/", (req, res) => res.json({ ok: true, message: "TaxPal API is running" }));

app.use((req, res) => res.status(404).json({ ok: false, error: "Not Found", path: req.path }));

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ ok: false, error: "Server error" });
});

export default app;
