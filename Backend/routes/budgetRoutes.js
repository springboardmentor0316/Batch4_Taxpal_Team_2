// routes/budgetRoutes.js
import express from "express";
import { 
  createBudget, 
  getBudgets, 
  updateBudget, 
  deleteBudget 
} from "../controllers/budgetController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticateToken, createBudget);
router.get("/", authenticateToken, getBudgets);
router.put("/:id", authenticateToken, updateBudget);
router.delete("/:id", authenticateToken, deleteBudget);

export default router;
