// routes/budgetRoutes.js
import express from "express";
import { createBudget, getBudgets } from "../controllers/budgetController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Create budget
router.post("/", authenticateToken, createBudget);

// Fetch budgets (so UI can display them)
router.get("/", authenticateToken, getBudgets);

export default router;
