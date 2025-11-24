// controllers/transactionController.js
import mongoose from "mongoose";
import Transaction from "../models/transaction.js";

export const recordIncome = async (req, res) => {
  try {
    const { description, amount, category, date, notes } = req.body;
    const userId = req.userId;

    if (!description || !amount || !category || !date) {
      return res.status(400).json({ success: false, error: "Please provide all required fields: description, amount, category, and date" });
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({ success: false, error: "Amount must be a positive number" });
    }

    const income = new Transaction({
      userId,
      type: "income",
      description: description.trim(),
      amount: parseFloat(amount),
      category: category.trim(),
      date: new Date(date),
      notes: notes ? notes.trim() : "",
    });

    await income.save();

    res.status(201).json({ success: true, message: "Income recorded successfully", data: income });
  } catch (error) {
    console.error("Error recording income:", error);
    res.status(500).json({ success: false, error: "Failed to record income. Please try again." });
  }
};

export const recordExpense = async (req, res) => {
  try {
    const { description, amount, category, date, notes } = req.body;
    const userId = req.userId;

    if (!description || !amount || !category || !date) {
      return res.status(400).json({ success: false, error: "Please provide all required fields: description, amount, category, and date" });
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({ success: false, error: "Amount must be a positive number" });
    }

    const expense = new Transaction({
      userId,
      type: "expense",
      description: description.trim(),
      amount: parseFloat(amount),
      category: category.trim(),
      date: new Date(date),
      notes: notes ? notes.trim() : "",
    });

    await expense.save();

    res.status(201).json({ success: true, message: "Expense recorded successfully", data: expense });
  } catch (error) {
    console.error("Error recording expense:", error);
    res.status(500).json({ success: false, error: "Failed to record expense. Please try again." });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const userId = req.userId;
    const { type, limit = 10, skip = 0 } = req.query;
    const query = { userId };
    if (type && (type === "income" || type === "expense")) query.type = type;

    const transactions = await Transaction.find(query).sort({ date: -1, createdAt: -1 }).limit(parseInt(limit)).skip(parseInt(skip));
    const total = await Transaction.countDocuments(query);

    res.status(200).json({ success: true, data: transactions, pagination: { total, limit: parseInt(limit), skip: parseInt(skip) } });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ success: false, error: "Failed to fetch transactions" });
  }
};

export const getRecentTransactions = async (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 5;
    const transactions = await Transaction.find({ userId }).sort({ date: -1, createdAt: -1 }).limit(limit);

    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    console.error("Error fetching recent transactions:", error);
    res.status(500).json({ success: false, error: "Failed to fetch recent transactions" });
  }
};

export const getTransactionSummary = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const summary = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          ...(start && end ? { date: { $gte: start, $lt: end } } : {})
        },
      },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]);

    const totalIncome = summary.find((x) => x._id === "income")?.total || 0;
    const totalExpense = summary.find((x) => x._id === "expense")?.total || 0;

    res.status(200).json({ success: true, data: { totalIncome, totalExpense, balance: totalIncome - totalExpense } });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ success: false, error: "Failed to fetch transaction summary" });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const transaction = await Transaction.findOneAndDelete({ _id: id, userId });

    if (!transaction) {
      return res.status(404).json({ success: false, error: "Transaction not found" });
    }

    res.status(200).json({ success: true, message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ success: false, error: "Failed to delete transaction" });
  }
};
