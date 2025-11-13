// models/Budget.js
import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    month: { type: String, required: true }, // example: "2025-01"
    description: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Budget", BudgetSchema);
