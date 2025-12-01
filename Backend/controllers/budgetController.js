// controllers/budgetController.js
import Budget from "../models/Budget.js";

/* ================================
   CREATE BUDGET
================================ */
export const createBudget = async (req, res) => {
  try {
    const { category, amount, month, description } = req.body;

    const budget = await Budget.create({
      userId: req.userId,
      category,
      amount,
      month,
      description,
    });

    res.status(201).json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================================
   GET ALL BUDGETS
================================ */
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.userId });
    res.json({ success: true, data: budgets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================================
   UPDATE BUDGET
================================ */
export const updateBudget = async (req, res) => {
  try {
    const id = req.params.id;
    const { category, amount, month, description } = req.body;

    const existing = await Budget.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }

    // Only the owner can update
    if (!existing.userId.equals(req.userId)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    existing.category = category ?? existing.category;
    existing.amount = amount ?? existing.amount;
    existing.month = month ?? existing.month;
    existing.description = description ?? existing.description;

    const updated = await existing.save();

    return res.json({ success: true, data: updated, message: "Budget updated successfully" });
  } catch (error) {
    console.error("Update budget error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================================
   DELETE BUDGET
================================ */
export const deleteBudget = async (req, res) => {
  try {
    const id = req.params.id;

    const existing = await Budget.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }

    if (!existing.userId.equals(req.userId)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await Budget.findByIdAndDelete(id);

    return res.json({ success: true, message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Delete budget error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
