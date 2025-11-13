import express from "express";
import {
  recordIncome,
  recordExpense,
  getTransactions,
  getRecentTransactions,
  getTransactionSummary,
  deleteTransaction,
} from "../controllers/transactionController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Transaction CRUD routes
router.post("/income", recordIncome);
router.post("/expense", recordExpense);
router.get("/", getTransactions);
router.get("/recent", getRecentTransactions);
router.get("/summary", getTransactionSummary);
router.delete("/:id", deleteTransaction);

export default router;