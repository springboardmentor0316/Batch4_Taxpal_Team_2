// controllers/taxestimatorcontroller.js
import Tax from "../models/Taxestimator.js";

/* ---------- tax calculation helpers ---------- */
function calculateIndiaTax(income) {
  if (income <= 300000) return 0;
  if (income <= 600000) return (income - 300000) * 0.05;
  if (income <= 900000) return 15000 + (income - 600000) * 0.1;
  if (income <= 1200000) return 45000 + (income - 900000) * 0.15;
  if (income <= 1500000) return 90000 + (income - 1200000) * 0.2;
  return 150000 + (income - 1500000) * 0.3;
}
function calculateUSTax(income) {
  if (income <= 11000) return income * 0.1;
  if (income <= 44725) return 1100 + (income - 11000) * 0.12;
  if (income <= 95375) return 5147 + (income - 44725) * 0.22;
  if (income <= 182100) return 16290 + (income - 95375) * 0.24;
  if (income <= 231250) return 37104 + (income - 182100) * 0.32;
  if (income <= 578125) return 52832 + (income - 231250) * 0.35;
  return 174238 + (income - 578125) * 0.37;
}
function calculateUKTax(income) {
  if (income <= 12570) return 0;
  if (income <= 50270) return (income - 12570) * 0.2;
  if (income <= 125140) return 7540 + (income - 50270) * 0.4;
  return 7540 + 29948 + (income - 125140) * 0.45;
}
function calculateAustraliaTax(income) {
  if (income <= 18200) return 0;
  if (income <= 45000) return (income - 18200) * 0.19;
  if (income <= 120000) return 5092 + (income - 45000) * 0.325;
  if (income <= 180000) return 29467 + (income - 120000) * 0.37;
  return 51667 + (income - 180000) * 0.45;
}
function calculateTaxByRegion(region, income) {
  switch ((region || "").toLowerCase()) {
    case "in":
    case "india":
      return calculateIndiaTax(income);
    case "us":
    case "united states":
    case "united states of america":
      return calculateUSTax(income);
    case "uk":
    case "united kingdom":
      return calculateUKTax(income);
    case "au":
    case "australia":
      return calculateAustraliaTax(income);
    default:
      return income * 0.25;
  }
}

/* ---------- controller methods ---------- */

export async function calc(req, res) {
  try {
    const body = req.body || {};

    // Accept flexible input names:
    // - quarterly gross may be provided as: income, grossIncome, grossQuarter
    // - or the client may send annualIncome already
    const incomeQuarter =
      Number(body.income ?? body.grossIncome ?? body.grossQuarter ?? 0);
    const annualFromQuarter = incomeQuarter * 4;
    const annual = Number(body.annualIncome ?? annualFromQuarter ?? 0);

    // Accept deductions either as a nested `deductions` object OR as top-level fields
    const deductionsObj = body.deductions || {};
    const businessExpenses =
      Number(deductionsObj.businessExpenses ?? body.businessExpenses ?? 0);
    const retirementContributions =
      Number(deductionsObj.retirementContributions ?? body.retirementContributions ?? 0);
    const healthInsurance =
      Number(deductionsObj.healthInsurance ?? body.healthInsurance ?? 0);
    const homeOfficeDeduction =
      Number(deductionsObj.homeOfficeDeduction ?? body.homeOfficeDeduction ?? 0);

    const deductionsSum =
      businessExpenses + retirementContributions + healthInsurance + homeOfficeDeduction;

    const taxableIncome = Math.max(annual - deductionsSum, 0);

    // region may be passed as country or region
    const region = (body.country || body.region || "").toString();

    const tax = calculateTaxByRegion(region, taxableIncome);

    // Return keys that match your frontend naming (taxable_income, estimated_tax)
    return res.json({
      success: true,
      result: {
        taxable_income: taxableIncome,
        estimated_tax: tax,
      },
    });
  } catch (err) {
    console.error("calc error", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

export async function save(req, res) {
  try {
    const payload = req.body || {};

    // Coerce numeric fields safely
    const annualIncome = Number(payload.annualIncome ?? 0);
    const deductions = Number(payload.deductions ?? 0);
    const taxableIncome = Number(payload.taxableIncome ?? 0);
    const estimatedQuarterlyTaxes = Number(payload.estimatedQuarterlyTaxes ?? 0);
    const estimatedTax = Number(payload.estimatedTax ?? 0);

    const doc = new Tax({
      userId: req.userId || null,
      annualIncome,
      deductions,
      taxableIncome,
      estimatedQuarterlyTaxes,
      estimatedTax,
      region: payload.region || "",
      status: payload.status || "",
    });

    const saved = await doc.save();
    return res.status(201).json({ success: true, data: saved, message: "Saved successfully" });
  } catch (err) {
    console.error("save error", err);
    return res.status(500).json({ success: false, error: "Failed to save" });
  }
}

export async function list(req, res) {
  try {
    const q = {};
    if (req.userId) q.userId = req.userId;
    const docs = await Tax.find(q).sort({ createdAt: -1 }).limit(100);
    return res.json({ success: true, data: docs });
  } catch (err) {
    console.error("list error", err);
    return res.status(500).json({ success: false, data: [] });
  }
}

export async function update(req, res) {
  try {
    const id = req.params.id;
    const body = req.body || {};
    const updated = await Tax.findByIdAndUpdate(id, body, { new: true });
    if (!updated) return res.status(404).json({ success: false, error: "Not found" });
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error("update error", err);
    return res.status(500).json({ success: false, error: "Update failed" });
  }
}

export async function remove(req, res) {
  try {
    const id = req.params.id;
    const doc = await Tax.findById(id);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });

    // Ensure only owner can delete (if userId exists)
    if (req.userId && doc.userId && String(doc.userId) !== String(req.userId)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await Tax.findByIdAndDelete(id);
    return res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("delete error", err);
    return res.status(500).json({ success: false, message: "Delete failed" });
  }
}
