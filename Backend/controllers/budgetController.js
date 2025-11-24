// controllers/budgetController.js
import Budget from "../models/Budget.js";

export const createBudget = async (req, res) => {
  try {
    const { category, amount, month, description } = req.body;

    const budget = await Budget.create({
      userId: req.userId, // from authenticate middleware
      category,
      amount,
      month,
      description
    });

    res.status(201).json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.userId });
    res.json({ success: true, data: budgets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
