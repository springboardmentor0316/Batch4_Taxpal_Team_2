// controllers/reportsController.js
import Report from "../models/Report.js";
import Transaction from "../models/Transaction.js";
import PDFDocument from "pdfkit";

/**
 * Reports controller (ESM)
 * Endpoints:
 * - generateReport(req, res)
 * - listReports(req, res)
 * - getReport(req, res)
 * - downloadReport(req, res)
 * - deleteReport(req, res)
 */

// helper to compute totals from transactions
const computeTotals = (transactions = []) => {
  let totalIncome = 0;
  let totalExpenses = 0;
  for (const t of transactions) {
    if (!t) continue;
    const amount = Number(t.amount) || 0;
    const type = (t.type || "").toString().toLowerCase();
    if (type === "income" || type === "credit") totalIncome += amount;
    else totalExpenses += amount;
  }
  return { totalIncome, totalExpenses, netIncome: totalIncome - totalExpenses };
};

const sanitizeFilename = (name = "report") =>
  String(name).replace(/[^a-z0-9-_. ()]/gi, "").trim() || "report";

const periodToRange = (period) => {
  const now = new Date();
  let start = new Date(now);
  let end = new Date(now);

  if (period === "Current Month") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    start.setHours(0, 0, 0, 0);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
  } else if (period === "Last Month") {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    start.setHours(0, 0, 0, 0);
    end = new Date(now.getFullYear(), now.getMonth(), 0);
    end.setHours(23, 59, 59, 999);
  } else if (period === "Current Quarter") {
    const q = Math.floor(now.getMonth() / 3);
    start = new Date(now.getFullYear(), q * 3, 1);
    start.setHours(0, 0, 0, 0);
    end = new Date(now.getFullYear(), q * 3 + 3, 0);
    end.setHours(23, 59, 59, 999);
  } else if (period === "Current Year") {
    start = new Date(now.getFullYear(), 0, 1);
    start.setHours(0, 0, 0, 0);
    end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
  } else {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    start.setHours(0, 0, 0, 0);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
  }

  return { start, end };
};

export const generateReport = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Not authenticated" });

    const { reportType = "Income Statement", period = "Current Month", format = "PDF", startDate, endDate } = req.body || {};

    const filter = { userId };
    let periodStart = null;
    let periodEnd = null;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        const s = new Date(startDate);
        if (!isNaN(s.getTime())) {
          filter.date.$gte = s;
          periodStart = s;
        }
      }
      if (endDate) {
        const e = new Date(endDate);
        if (!isNaN(e.getTime())) {
          filter.date.$lte = e;
          periodEnd = e;
        }
      }
    } else if (period) {
      const { start, end } = periodToRange(period);
      filter.date = { $gte: start, $lte: end };
      periodStart = start;
      periodEnd = end;
    }

    const transactions = await Transaction.find(filter).lean();
    const totals = computeTotals(transactions);

    const now = new Date();
    const title = `${reportType} - ${period}`;

    const reportDoc = await Report.create({
      userId,
      title,
      period,
      generatedAt: now,
      totalIncome: totals.totalIncome,
      totalExpenses: totals.totalExpenses,
      netIncome: totals.netIncome,
      format: (format || "PDF").toUpperCase(),
      metadata: { transactionsCount: transactions.length, filter, periodStart: periodStart ? periodStart.toISOString() : null, periodEnd: periodEnd ? periodEnd.toISOString() : null },
    });

    return res.status(201).json({ success: true, data: reportDoc });
  } catch (err) {
    console.error("generateReport error", err);
    return res.status(500).json({ success: false, error: "Failed to generate report" });
  }
};

export const listReports = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Not authenticated" });

    const { limit = 50, skip = 0 } = req.query;
    const docs = await Report.find({ userId })
      .sort({ generatedAt: -1 })
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 50)
      .lean();
    return res.json({ success: true, data: docs });
  } catch (err) {
    console.error("listReports error", err);
    return res.status(500).json({ success: false, error: "Failed to list reports" });
  }
};

export const getReport = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Not authenticated" });

    const { id } = req.params;
    const doc = await Report.findById(id).lean();
    if (!doc) return res.status(404).json({ success: false, error: "Not found" });
    if (String(doc.userId) !== String(userId)) return res.status(403).json({ success: false, error: "Not authorized" });

    return res.json({ success: true, data: doc });
  } catch (err) {
    console.error("getReport error", err);
    return res.status(500).json({ success: false, error: "Failed to fetch report" });
  }
};

export const downloadReport = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Not authenticated" });

    const { id } = req.params;
    const formatQuery = (req.query.format || "pdf").toString().toLowerCase();

    const doc = await Report.findById(id).lean();
    if (!doc) return res.status(404).json({ success: false, error: "Not found" });
    if (String(doc.userId) !== String(userId)) return res.status(403).json({ success: false, error: "Not authorized" });

    const filenameBase = sanitizeFilename(doc.title || `report-${doc._id}`);

    if (formatQuery === "pdf") {
      // Set headers for PDF download
      res.setHeader("Content-Disposition", `attachment; filename="${filenameBase}.pdf"`);
      res.setHeader("Content-Type", "application/pdf");

      const pdf = new PDFDocument({ margin: 40, size: "A4" });
      pdf.pipe(res);

      const pageWidth = pdf.page.width;
      const pageHeight = pdf.page.height;
      const left = 40;
      const right = pageWidth - 40;

      // Colors
      const primary = "#1e3a8a";
      const muted = "#6b7280";
      const boxBorder = "#e6eef6";
      const positive = "#059669";
      const negative = "#dc2626";

      // HEADER - centered title
      pdf.fontSize(20).fillColor(primary).font("Helvetica-Bold");
      pdf.text(doc.title || "Financial Report", { align: "center" });
      pdf.moveDown(0.25);

      pdf.fontSize(10).fillColor(muted).font("Helvetica");
      pdf.text(`Period: ${doc.period || "-"}`, { align: "center" });
      pdf.text(`Generated: ${new Date(doc.generatedAt).toLocaleString()}`, { align: "center" });
      pdf.moveDown(0.8);

      // Summary box dimensions
      const boxWidth = pageWidth - left - 40;
      const boxHeight = 110;
      const boxX = left;
      const boxY = pdf.y;

      // Draw box (rounded corners if available)
      try {
        if (typeof pdf.roundedRect === "function") {
          pdf.lineWidth(1).strokeColor(boxBorder).roundedRect(boxX, boxY, boxWidth, boxHeight, 8).fillAndStroke("#fbfdff", boxBorder);
        } else {
          // fallback: draw rectangle with stroke + fill
          pdf.rect(boxX, boxY, boxWidth, boxHeight).fillAndStroke("#fbfdff", boxBorder);
        }
      } catch (err) {
        // fallback to simple rect if anything fails
        pdf.rect(boxX, boxY, boxWidth, boxHeight).fillAndStroke("#fbfdff", boxBorder);
      }

      // Put text inside the box
      const innerLeft = boxX + 18;
      let y = boxY + 18;
      pdf.fontSize(12).fillColor("#0f172a").font("Helvetica-Bold").text("Summary", innerLeft, y);
      y += 20;

      pdf.fontSize(11).fillColor("#0f172a").font("Helvetica");
      pdf.text(`Total Income: ₹${Number(doc.totalIncome || 0).toLocaleString("en-IN")}`, innerLeft, y);
      y += 18;
      pdf.text(`Total Expenses: ₹${Number(doc.totalExpenses || 0).toLocaleString("en-IN")}`, innerLeft, y);
      y += 20;

      // Net income emphasized on right side of box
      const netText = `Net Income: ₹${Number(doc.netIncome || 0).toLocaleString("en-IN")}`;
      pdf.fontSize(13).fillColor((doc.netIncome || 0) >= 0 ? positive : negative).font("Helvetica-Bold");
      // place on right side of box
      const rightLabelX = boxX + boxWidth - 18 - pdf.widthOfString(netText);
      pdf.text(netText, rightLabelX, boxY + 56);

      pdf.moveDown(6);

      // Add transactions table if metadata.filter exists by querying Transaction
      let transactions = [];
      try {
        // prefer metadata.filter (saved at generation time)
        const filter = doc.metadata?.filter || {};
        // ensure userId match for safety
        filter.userId = filter.userId || doc.userId;
        transactions = await Transaction.find(filter).sort({ date: 1 }).lean();
      } catch (err) {
        // ignore, we'll just not include transactions
        console.warn("downloadReport: failed to load transactions for PDF table", err);
      }

      // If there are transactions, render a table
      if (Array.isArray(transactions) && transactions.length > 0) {
        pdf.addPage(); // use new page for table to keep layout clean
        const tableLeft = left;
        let cursorY = pdf.y;
        const rowHeight = 18;
        const colDateW = 80;
        const colTitleW = pageWidth - left - 40 - colDateW - 90; // remaining for title, leave 90 for type+amount
        const colTypeW = 60;
        const colAmountW = 90;

        // Table header
        pdf.fontSize(11).fillColor(primary).font("Helvetica-Bold");
        pdf.text("Date", tableLeft, cursorY, { width: colDateW });
        pdf.text("Title / Description", tableLeft + colDateW + 8, cursorY, { width: colTitleW });
        pdf.text("Type", tableLeft + colDateW + colTitleW + 12, cursorY, { width: colTypeW, align: "left" });
        pdf.text("Amount", tableLeft + colDateW + colTitleW + colTypeW + 18, cursorY, { width: colAmountW, align: "right" });
        cursorY += rowHeight;

        pdf.moveTo(tableLeft, cursorY - 6).lineTo(pageWidth - 40, cursorY - 6).lineWidth(0.5).strokeColor(boxBorder).stroke();

        pdf.fontSize(10).fillColor("#0f172a").font("Helvetica");

        const bottomMargin = 60;

        for (const tx of transactions) {
          // page break if near bottom
          if (cursorY > pageHeight - bottomMargin) {
            pdf.addPage();
            cursorY = pdf.y;
            // re-draw header on new page
            pdf.fontSize(11).fillColor(primary).font("Helvetica-Bold");
            pdf.text("Date", tableLeft, cursorY, { width: colDateW });
            pdf.text("Title / Description", tableLeft + colDateW + 8, cursorY, { width: colTitleW });
            pdf.text("Type", tableLeft + colDateW + colTitleW + 12, cursorY, { width: colTypeW, align: "left" });
            pdf.text("Amount", tableLeft + colDateW + colTitleW + colTypeW + 18, cursorY, { width: colAmountW, align: "right" });
            cursorY += rowHeight;
            pdf.moveTo(tableLeft, cursorY - 6).lineTo(pageWidth - 40, cursorY - 6).lineWidth(0.5).strokeColor(boxBorder).stroke();
            pdf.fontSize(10).fillColor("#0f172a").font("Helvetica");
          }

          // make safe strings
          const dateStr = tx.date ? new Date(tx.date).toLocaleDateString() : "-";
          const titleStr = String(tx.title || tx.description || "-").replace(/\r?\n|\r/g, " ");
          const typeStr = String(tx.type || "-");
          const amtStr = `₹${Number(tx.amount || 0).toLocaleString("en-IN")}`;

          pdf.text(dateStr, tableLeft, cursorY, { width: colDateW });
          pdf.text(titleStr, tableLeft + colDateW + 8, cursorY, { width: colTitleW });
          pdf.text(typeStr, tableLeft + colDateW + colTitleW + 12, cursorY, { width: colTypeW });
          pdf.text(amtStr, tableLeft + colDateW + colTitleW + colTypeW + 18, cursorY, { width: colAmountW, align: "right" });

          cursorY += rowHeight;
        }

        pdf.moveDown(1);
      }

      // FOOTER on the last page
      const footerText = `Generated by TaxPal • ${new Date().toLocaleString()}`;
      pdf.fontSize(9).fillColor(muted).font("Helvetica");
      pdf.text(footerText, left, pageHeight - 50, { align: "center", width: pageWidth - left * 2 });

      // finalize
      pdf.end();
      return;
    }

    // CSV export
    const rows = [
      ["Field", "Value"],
      ["Title", doc.title],
      ["Period", doc.period],
      ["Generated", new Date(doc.generatedAt).toLocaleString()],
      ["Total Income", doc.totalIncome],
      ["Total Expenses", doc.totalExpenses],
      ["Net Income", doc.netIncome],
    ];

    if (formatQuery === "csv") {
      const csv = rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
      res.setHeader("Content-Disposition", `attachment; filename="${filenameBase}.csv"`);
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      return res.send(csv);
    }

    if (formatQuery === "excel" || formatQuery === "xls") {
      const tsv = rows.map((r) => r.join("\t")).join("\n");
      res.setHeader("Content-Disposition", `attachment; filename="${filenameBase}.xls"`);
      res.setHeader("Content-Type", "application/vnd.ms-excel; charset=utf-8");
      return res.send(tsv);
    }

    return res.status(400).json({ success: false, error: "Unsupported format" });
  } catch (err) {
    console.error("downloadReport error", err);
    return res.status(500).json({ success: false, error: "Failed to download report" });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Not authenticated" });

    const { id } = req.params;
    const existing = await Report.findById(id);
    if (!existing) return res.status(404).json({ success: false, error: "Not found" });
    if (String(existing.userId) !== String(userId)) return res.status(403).json({ success: false, error: "Not authorized" });

    await Report.findByIdAndDelete(id);
    return res.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("deleteReport error", err);
    return res.status(500).json({ success: false, error: "Failed to delete report" });
  }
};
