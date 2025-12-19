import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    period: { type: String },
    generatedAt: { type: Date, default: Date.now },
    totalIncome: { type: Number, default: 0 },
    totalExpenses: { type: Number, default: 0 },
    netIncome: { type: Number, default: 0 },
    format: { type: String, enum: ["PDF", "CSV", "Excel"], default: "PDF" },
    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
);

const Report = mongoose.models.Report || mongoose.model("Report", ReportSchema);
export default Report;
