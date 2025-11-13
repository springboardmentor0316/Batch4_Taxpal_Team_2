import express from "express";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, getCategories);
router.post("/", authenticateToken, addCategory);
router.put("/:id", authenticateToken, updateCategory);
router.delete("/:id", authenticateToken, deleteCategory);

export default router;
