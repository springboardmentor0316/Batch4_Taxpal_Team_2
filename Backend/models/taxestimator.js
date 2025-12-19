// models/Taxestimator.js
import mongoose from "mongoose";

const TaxSchema = new mongoose.Schema(
  {
    userId: { type: String, default: null },
    annualIncome: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    taxableIncome: { type: Number, default: 0 },
    estimatedQuarterlyTaxes: { type: Number, default: 0 },
    estimatedTax: { type: Number, default: 0 },
    region: { type: String, default: "" },
    status: { type: String, default: "" },
  },
  { timestamps: true }
);

const Tax = mongoose.models.Tax || mongoose.model("Tax", TaxSchema);
export default Tax;
