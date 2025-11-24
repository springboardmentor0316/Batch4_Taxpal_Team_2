// models/Taxcalendar.js
import mongoose from "mongoose";

const TaxPaymentSchema = new mongoose.Schema(
  {
    userId: { type: String, default: null },
    paidQuarters: {
      type: Map,
      of: Boolean,
      default: { Q1: false, Q2: false, Q3: false, Q4: false },
    },
    estimatedQuarterlyTaxes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const TaxPayment = mongoose.models.TaxPayment || mongoose.model("TaxPayment", TaxPaymentSchema);
export default TaxPayment;
