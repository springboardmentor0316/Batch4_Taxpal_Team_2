// controllers/taxCalendarController.js
import TaxPayment from "../models/taxcalendar.js";

export async function getPayment(req, res) {
  try {
    const q = {};
    if (req.userId) q.userId = req.userId;

    let doc = await TaxPayment.findOne(q);
    if (!doc) {
      doc = new TaxPayment({
        userId: req.userId || null,
        paidQuarters: { Q1: false, Q2: false, Q3: false, Q4: false },
        estimatedQuarterlyTaxes: 0,
      });
      await doc.save();
    }

    const paidQuarters = doc.paidQuarters
      ? Object.fromEntries(Array.from(doc.paidQuarters.entries()))
      : { Q1: false, Q2: false, Q3: false, Q4: false };

    return res.json({
      id: doc._id,
      paidQuarters,
      estimatedQuarterlyTaxes: doc.estimatedQuarterlyTaxes,
    });
  } catch (err) {
    console.error("getPayment error", err);
    return res.status(500).json(null);
  }
}

export async function markQuarterPaid(req, res) {
  try {
    const quarter = (req.params.quarter || "").toUpperCase();
    if (!quarter) return res.status(400).json({ ok: false, error: "Quarter required" });

    const q = {};
    if (req.userId) q.userId = req.userId;

    let doc = await TaxPayment.findOne(q);
    if (!doc) {
      doc = new TaxPayment({
        userId: req.userId || null,
        paidQuarters: { Q1: false, Q2: false, Q3: false, Q4: false },
        estimatedQuarterlyTaxes: 0,
      });
    }

    doc.paidQuarters.set(quarter, true);

    if (req.body?.estimatedQuarterlyTaxes !== undefined) {
      doc.estimatedQuarterlyTaxes = Number(req.body.estimatedQuarterlyTaxes) || doc.estimatedQuarterlyTaxes;
    }

    await doc.save();

    const paidQuarters = doc.paidQuarters
      ? Object.fromEntries(Array.from(doc.paidQuarters.entries()))
      : { Q1: false, Q2: false, Q3: false, Q4: false };

    return res.json({ id: doc._id, paidQuarters, estimatedQuarterlyTaxes: doc.estimatedQuarterlyTaxes });
  } catch (err) {
    console.error("markQuarterPaid error", err);
    return res.status(500).json({ ok: false, error: "Failed to update payment" });
  }
}
