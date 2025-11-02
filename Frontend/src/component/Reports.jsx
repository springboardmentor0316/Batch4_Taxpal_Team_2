import React, { useState } from "react";
import "../styles/Reports.css";

const Reports = () => {
  const [reportType, setReportType] = useState("Income Statement");
  const [period, setPeriod] = useState("Current Month");
  const [format, setFormat] = useState("PDF");
  const [generatedReport, setGeneratedReport] = useState(null);
  const [recentReports, setRecentReports] = useState([]);

  const handleReset = () => {
    setReportType("Income Statement");
    setPeriod("Current Month");
    setFormat("PDF");
    setGeneratedReport(null);
  };

  const handleGenerate = () => {
    const now = new Date();
    const timestamp = now.toLocaleString("en-US", {
      dateStyle: "short",
      timeStyle: "medium",
    });

    const report = {
      title: `${reportType} - ${now.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      })}`,
      period: `${now.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      })}`,
      generated: timestamp,
      totalIncome: 0,
      totalExpenses: 0,
      netIncome: 0,
      format,
    };

    setGeneratedReport(report);
    setRecentReports((prev) => [report, ...prev]);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert(`Downloading ${generatedReport.title} as ${generatedReport.format}`);
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>Financial Reports</h2>
        <p>Generate and download your financial reports</p>
      </div>

      <div className="reports-content">
        {/* LEFT COLUMN */}
        <div className="left-column">
          {/* GENERATE REPORT CARD */}
          <div className="generate-report card">
            <h3>Generate Report</h3>

            <label>Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
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
              <button className="reset-btn" onClick={handleReset}>
                Reset
              </button>
              <button className="generate-btn" onClick={handleGenerate}>
                Generate Report
              </button>
            </div>
          </div>

          {/* RECENT REPORTS CARD */}
          <div className="recent-reports card">
            <h3>Recent Reports</h3>
            {recentReports.length === 0 ? (
              <div className="preview-placeholder">
                <span className="file-icon">📄</span>
                <p>No results.</p>
                <small>Generate a report to get started</small>
              </div>
            ) : (
              <ul className="recent-list">
                {recentReports.map((r, i) => (
                  <li
                    key={i}
                    className={`recent-item ${
                      generatedReport?.title === r.title ? "active" : ""
                    }`}
                    onClick={() => setGeneratedReport(r)}
                  >
                    <span className="recent-title">{r.title}</span>
                    <small>{r.generated}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* RIGHT PANEL - REPORT PREVIEW */}
        <div className="report-preview card">
          <h3>Report Preview</h3>
          {!generatedReport ? (
            <div className="preview-placeholder">
              <span className="file-icon">📥</span>
              <p>Select a report to preview</p>
              <small>
                Generated reports will appear here for review before downloading
              </small>
            </div>
          ) : (
            <div className="report-details">
              <div className="report-actions">
                <button onClick={handlePrint}>🖨️ Print</button>
                <button onClick={handleDownload}>⬇️ Download</button>
              </div>

              <div className="report-header">
                <h4>{generatedReport.title}</h4>
                <div className="report-meta">
                  <span>
                    Period: {generatedReport.period} • Generated:{" "}
                    {generatedReport.generated}
                  </span>
                  <hr />
                </div>
              </div>

              <div className="report-summary">
                <p>
                  <strong>Total Income:</strong>
                  <span className="green">
                    ${generatedReport.totalIncome.toFixed(2)}
                  </span>
                </p>
                <p>
                  <strong>Total Expenses:</strong>
                  <span className="red">
                    ${generatedReport.totalExpenses.toFixed(2)}
                  </span>
                </p>
                <hr />
                <p>
                  <strong>Net Income:</strong>
                  <span className="blue">
                    ${generatedReport.netIncome.toFixed(2)}
                  </span>
                </p>
              </div>

              <div className="report-footer">
                <h4>Transaction Summary</h4>
                <p>0 transactions in this period</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;