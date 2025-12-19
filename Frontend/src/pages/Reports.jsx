import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Reports.css";

/**
 * Reports page (frontend)
 * - Uses server endpoints:
 *   POST /api/reports/generate
 *   GET  /api/reports
 *   GET  /api/reports/:id/download?format=pdf|csv|excel
 *   GET  /api/transactions/summary
 *
 * Notes:
 * - Print HTML is generated client-side and styled to match the dashboard.
 * - If you want server-generated PDF style parity, update backend's PDF code in controllers/reportsController.downloadReport
 */

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value || 0);

const sanitizeFilename = (name) => (name || "report").replace(/[\\/:"*?<>|]+/g, "").trim();

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getPeriodDates = (period) => {
  const now = new Date();
  let start = new Date(now);
  let end = new Date(now);

  if (period === "Current Month") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
  } else if (period === "Last Month") {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    start.setHours(0, 0, 0, 0);
    end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
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
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
  }

  return { startDate: start.toISOString(), endDate: end.toISOString() };
};

export default function Reports(props) {
  const [reportType, setReportType] = useState("Income Statement");
  const [period, setPeriod] = useState("Current Month");
  const [format, setFormat] = useState("PDF");
  const [generatedReport, setGeneratedReport] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [transactionSummary, setTransactionSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0, totalCount: 0 });

  const fetchRecentReports = useCallback(async () => {
    setLoadingReports(true);
    try {
      const res = await fetch(`${API_BASE}/api/reports`, {
        method: "GET",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || data?.message || "Failed to load reports");
      setRecentReports(Array.isArray(data?.data) ? data.data : data?.data || []);
    } catch (err) {
      console.error("fetchRecentReports:", err);
      toast.error("Failed to load reports. Make sure you are signed in.");
    } finally {
      setLoadingReports(false);
    }
  }, []);

  const fetchTransactionSummary = useCallback(async (startDate, endDate) => {
    setSummaryLoading(true);
    try {
      let url = `${API_BASE}/api/transactions/summary`;
      if (startDate || endDate) {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        url += `?${params.toString()}`;
      }

      const res = await fetch(url, {
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch transactions summary");
      const totals = data?.data || { totalIncome: 0, totalExpenses: 0, balance: 0, totalCount: 0 };
      setTransactionSummary({
        totalIncome: totals.totalIncome ?? 0,
        totalExpenses: totals.totalExpenses ?? totals.totalExpense ?? 0,
        balance: totals.balance ?? (totals.totalIncome - (totals.totalExpenses ?? totals.totalExpense ?? 0)) ?? 0,
        totalCount: totals.totalCount ?? 0,
      });
    } catch (err) {
      console.warn("fetchTransactionSummary:", err);
      setTransactionSummary({ totalIncome: 0, totalExpenses: 0, balance: 0, totalCount: 0 });
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentReports();
    const { startDate, endDate } = getPeriodDates(period);
    fetchTransactionSummary(startDate, endDate);
  }, [fetchRecentReports, fetchTransactionSummary, period]);

  const handleReset = () => {
    setReportType("Income Statement");
    setPeriod("Current Month");
    setFormat("PDF");
    setGeneratedReport(null);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { startDate, endDate } = getPeriodDates(period);
      const body = {
        reportType,
        period,
        format,
        startDate,
        endDate,
      };

      const res = await fetch(`${API_BASE}/api/reports/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || data?.message || "Failed to generate report");

      const report = data.data;
      setGeneratedReport(report);
      await fetchRecentReports();

      setTransactionSummary((prev) => ({
        ...prev,
        totalIncome: report.totalIncome ?? prev.totalIncome,
        totalExpenses: report.totalExpenses ?? prev.totalExpenses,
        balance: (report.totalIncome ?? prev.totalIncome) - (report.totalExpenses ?? prev.totalExpenses),
        totalCount: report.metadata?.transactionsCount ?? prev.totalCount,
      }));

      toast.success("Report generated successfully!");
    } catch (err) {
      console.error("handleGenerate:", err);
      toast.error(err.message || "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (report = generatedReport) => {
    if (!report) {
      toast.error("No report selected");
      return;
    }
    setDownloading(true);
    try {
      const fmt = (report.format || format || "PDF").toString().toLowerCase();
      const url = `${API_BASE}/api/reports/${report._id}/download?format=${encodeURIComponent(fmt)}`;
      const res = await fetch(url, {
        method: "GET",
        headers: { ...getAuthHeaders() }, // don't set content-type for blob responses
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || json?.message || `Download failed (${res.status})`);
      }

      const blob = await res.blob();
      const ext = fmt === "csv" ? "csv" : fmt === "excel" || fmt === "xls" ? "xls" : "pdf";
      const filename = `${sanitizeFilename(report.title || report._id)}.${ext}`;
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
      toast.success("Download started");
    } catch (err) {
      console.error("handleDownload:", err);
      toast.error(err.message || "Download failed");
    } finally {
      setDownloading(false);
    }
  };

  // compact print CSS used inside popup — kept small but consistent with Reports.css
  const PRINT_CSS = `
    body { font-family: Inter, Arial, sans-serif; padding: 28px; color: #0f172a; }
    .print-header { display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px; }
    .print-title { font-size: 24px; color: #1e3a8a; font-weight: 700; margin:0; }
    .print-meta { font-size: 13px; color: #6b7280; }
    .summary-box { border: 1px solid #e6eef6; background: #fbfdff; padding: 18px; border-radius: 10px; margin: 18px 0; }
    .summary-row { display:flex; justify-content:space-between; padding:8px 0; font-size:15px; align-items:center; }
    .summary-row .label { color:#475569; font-weight:600; }
    .summary-row .value { color:#0f172a; font-weight:700; }
    .net-positive { color: #059669; }
    .net-negative { color: #dc2626; }
    .print-footer { text-align:center; font-size:12px; color:#6b7280; margin-top:30px; }
    table.print-table { width:100%; border-collapse:collapse; margin-top:12px; font-size:13px; }
    table.print-table th, table.print-table td { border:1px solid #e6eef6; padding:8px 10px; text-align:left; }
    table.print-table th { background:#f8fafc; font-weight:600; }
    @media print { .print-footer { position:fixed; bottom:12px; left:0; right:0; } }
  `;

  const handlePrint = () => {
    if (!generatedReport) {
      toast.error("No report to print");
      return;
    }

    // values prefer server saved fields, fallback to transactionSummary
    const title = generatedReport.title || "Financial Report";
    const periodLabel = generatedReport.period || "-";
    const generatedAt = generatedReport.generatedAt || generatedReport.generated || new Date().toISOString();

    const totalIncome = generatedReport.totalIncome ?? transactionSummary.totalIncome ?? 0;
    const totalExpenses = generatedReport.totalExpenses ?? transactionSummary.totalExpenses ?? 0;
    const netIncome = generatedReport.netIncome ?? transactionSummary.balance ?? (totalIncome - totalExpenses);
    const transactionsCount = generatedReport.metadata?.transactionsCount ?? transactionSummary.totalCount ?? 0;

    const content = `
      <html>
        <head>
          <title>${title}</title>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <style>${PRINT_CSS}</style>
        </head>
        <body>
          <div class="print-header">
            <div>
              <h1 class="print-title">${title}</h1>
              <div class="print-meta">Period: ${periodLabel} • Generated: ${new Date(generatedAt).toLocaleString()}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:12px;color:#6b7280">Transactions: ${transactionsCount}</div>
            </div>
          </div>

          <div class="summary-box">
            <div class="summary-row"><div class="label">Total Income</div><div class="value">${formatCurrency(totalIncome)}</div></div>
            <div class="summary-row"><div class="label">Total Expenses</div><div class="value">${formatCurrency(totalExpenses)}</div></div>
            <hr style="border:none;border-top:1px solid #e6eef6;margin:10px 0;" />
            <div class="summary-row"><div class="label">Net Income</div><div class="value ${netIncome >= 0 ? 'net-positive' : 'net-negative'}">${formatCurrency(netIncome)}</div></div>
          </div>

          <!-- Optional transactions table (uncomment if you pass transaction rows into generatedReport.transactions) -->
          ${generatedReport.transactions && generatedReport.transactions.length ? `
            <table class="print-table">
              <thead><tr><th>Date</th><th>Title</th><th>Type</th><th>Amount</th></tr></thead>
              <tbody>
                ${generatedReport.transactions.map(tx => `
                  <tr>
                    <td>${new Date(tx.date).toLocaleDateString()}</td>
                    <td>${(tx.title || tx.description || "").toString().replace(/</g, "&lt;")}</td>
                    <td>${(tx.type || "")}</td>
                    <td style="text-align:right">${formatCurrency(tx.amount)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          ` : ""}

          <div class="print-footer">Generated by TaxPal • ${new Date().getFullYear()}</div>
        </body>
      </html>
    `;

    const popup = window.open("", "_blank", "width=900,height=700");
    if (!popup) {
      toast.error("Unable to open print window (maybe popup blocked)");
      return;
    }
    popup.document.open();
    popup.document.write(content);
    popup.document.close();
    popup.focus();
    // give the browser a moment to layout before printing
    setTimeout(() => {
      popup.print();
      // do not auto-close immediately — some browsers need user to confirm print
      // you can uncomment next line if you prefer auto-close after print:
      // popup.close();
    }, 350);
  };

  const onRecentClick = (r) => {
    setGeneratedReport(r);
    setTransactionSummary((prev) => ({
      ...prev,
      totalIncome: r.totalIncome ?? prev.totalIncome,
      totalExpenses: r.totalExpenses ?? r.totalExpense ?? prev.totalExpenses,
      balance: (r.totalIncome ?? prev.totalIncome) - (r.totalExpenses ?? prev.totalExpenses),
      totalCount: r.metadata?.transactionsCount ?? prev.totalCount,
    }));
  };

  return (
    <div className="reports-container">
      <ToastContainer />

      <div className="reports-header">
        <h2>Financial Reports</h2>
        <p>Generate and download your financial reports</p>
      </div>

      <div className="reports-content">
        <div className="left-column">
          <div className="generate-report card">
            <h3>Generate Report</h3>

            <label>Report Type</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option>Income Statement</option>
              <option>Balance Sheet</option>
              <option>Cash Flow Statement</option>
            </select>

            <label>Period</label>
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option>Current Month</option>
              <option>Last Month</option>
              <option>Current Quarter</option>
              <option>Current Year</option>
            </select>

            <label>Format</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              <option>PDF</option>
              <option>Excel</option>
              <option>CSV</option>
            </select>

            <div className="button-group">
              <button className="reset-btn" onClick={handleReset} disabled={generating || downloading}>Reset</button>
              <button
                className="generate-btn"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? "Generating..." : "Generate Report"}
              </button>
            </div>
          </div>

          <div className="recent-reports card">
            <h3>Recent Reports</h3>

            {loadingReports ? (
              <div style={{ padding: 12 }}>Loading…</div>
            ) : recentReports.length === 0 ? (
              <div className="preview-placeholder">
                <span className="file-icon">📄</span>
                <p>No results.</p>
                <small>Generate a report to get started</small>
              </div>
            ) : (
              <ul className="recent-list">
                {recentReports.map((r, i) => (
                  <li
                    key={r._id ?? i}
                    className={`recent-item ${generatedReport?._id === r._id ? "active" : ""}`}
                    onClick={() => onRecentClick(r)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter") onRecentClick(r); }}
                  >
                    <span className="recent-title">{r.title}</span>
                    <small>{new Date(r.generatedAt || r.generated || Date.now()).toLocaleString()}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="report-preview card">
          <h3>Report Preview</h3>

          {!generatedReport ? (
            <div className="preview-placeholder">
              <span className="file-icon">📥</span>
              <p>Select a report to preview</p>
              <small>Generated reports will appear here</small>
            </div>
          ) : (
            <div className="report-details">
              <div className="report-actions">
                <button onClick={handlePrint} disabled={downloading || generating}>🖨️ Print</button>

                <button onClick={() => handleDownload()} disabled={downloading}>
                  {downloading ? "Downloading..." : "⬇️ Download"}
                </button>
              </div>

              <h4>{generatedReport.title}</h4>

              <div className="report-meta">
                Period: {generatedReport.period} • Generated: {new Date(generatedReport.generatedAt || generatedReport.generated).toLocaleString()}
                <hr />
              </div>

              <div className="report-summary">
                <p>
                  <strong>Total Income:</strong>
                  <span className="green"> {formatCurrency(generatedReport.totalIncome ?? transactionSummary.totalIncome)} </span>
                </p>
                <p>
                  <strong>Total Expenses:</strong>
                  <span className="red"> {formatCurrency(generatedReport.totalExpenses ?? transactionSummary.totalExpenses)} </span>
                </p>
                <hr />
                <p>
                  <strong>Net Income:</strong>
                  <span className="blue"> {formatCurrency(generatedReport.netIncome ?? transactionSummary.balance)} </span>
                </p>
              </div>

              <div className="report-footer">
                <h4>Transaction Summary</h4>
                {summaryLoading ? <p>Loading…</p> :
                  <p>{(generatedReport.metadata?.transactionsCount ?? transactionSummary?.totalCount ?? 0)} transactions in this period</p>
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
