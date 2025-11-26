import React, { useState } from "react";
import jsPDF from "jspdf";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Reports.css";

const Reports = ({ totalIncome, totalExpenses }) => {
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
    const timestamp = now.toLocaleString("en-US", { dateStyle: "short", timeStyle: "medium" });

    const report = {
      title: `${reportType} - ${now.toLocaleString("en-US", { month: "long", year: "numeric" })}`,
      period: `${now.toLocaleString("en-US", { month: "long", year: "numeric" })}`,
      generated: timestamp,
      totalIncome: totalIncome || 0,
      totalExpenses: totalExpenses || 0,
      netIncome: (totalIncome || 0) - (totalExpenses || 0),
      format,
    };

    setGeneratedReport(report);
    setRecentReports(prev => [report, ...prev]);
    toast.success("Report generated successfully!");
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text(generatedReport.title, 20, 20);
    pdf.setFontSize(14);
    pdf.text(`Period: ${generatedReport.period}`, 20, 40);
    pdf.text(`Generated: ${generatedReport.generated}`, 20, 55);
    pdf.text(`Total Income: ₹${generatedReport.totalIncome}`, 20, 75);
    pdf.text(`Total Expenses: ₹${generatedReport.totalExpenses}`, 20, 90);
    pdf.text(`Net Income: ₹${generatedReport.netIncome}`, 20, 110);
    pdf.save(`${generatedReport.title}.pdf`);
    toast.success("PDF downloaded successfully!");
  };

  const downloadCSV = () => {
    const csvContent = `
Title,${generatedReport.title}
Period,${generatedReport.period}
Generated,${generatedReport.generated}
Total Income,${generatedReport.totalIncome}
Total Expenses,${generatedReport.totalExpenses}
Net Income,${generatedReport.netIncome}
`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${generatedReport.title}.csv`;
    a.click();
    toast.success("CSV downloaded successfully!");
  };

  const downloadExcel = () => {
    const excelContent = `
Title\t${generatedReport.title}
Period\t${generatedReport.period}
Generated\t${generatedReport.generated}
Total Income\t${generatedReport.totalIncome}
Total Expenses\t${generatedReport.totalExpenses}
Net Income\t${generatedReport.netIncome}
`;
    const blob = new Blob([excelContent], { type: "application/vnd.ms-excel" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${generatedReport.title}.xls`;
    a.click();
    toast.success("Excel file downloaded!");
  };

  const handleDownload = () => {
    if (!generatedReport) return;
    if (generatedReport.format === "PDF") downloadPDF();
    if (generatedReport.format === "CSV") downloadCSV();
    if (generatedReport.format === "Excel") downloadExcel();
  };

  const handlePrint = () => {
    window.print();
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
            <select value={reportType} onChange={e => setReportType(e.target.value)}>
              <option>Income Statement</option>
              <option>Balance Sheet</option>
              <option>Cash Flow Statement</option>
            </select>

            <label>Period</label>
            <select value={period} onChange={e => setPeriod(e.target.value)}>
              <option>Current Month</option>
              <option>Last Month</option>
              <option>Current Quarter</option>
              <option>Current Year</option>
            </select>

            <label>Format</label>
            <select value={format} onChange={e => setFormat(e.target.value)}>
              <option>PDF</option>
              <option>Excel</option>
              <option>CSV</option>
            </select>

            <div className="button-group">
              <button className="reset-btn" onClick={handleReset}>Reset</button>
              <button className="generate-btn" onClick={handleGenerate}>Generate Report</button>
            </div>
          </div>

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
                    className={`recent-item ${generatedReport?.title === r.title ? "active" : ""}`}
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
                <button onClick={handlePrint}>🖨️ Print</button>
                <button onClick={handleDownload}>⬇️ Download</button>
              </div>

              <h4>{generatedReport.title}</h4>

              <div className="report-meta">
                Period: {generatedReport.period} • Generated: {generatedReport.generated}
                <hr />
              </div>

              <div className="report-summary">
                <p>
                  <strong>Total Income:</strong>
                  <span className="green"> ₹{generatedReport.totalIncome} </span>
                </p>
                <p>
                  <strong>Total Expenses:</strong>
                  <span className="red"> ₹{generatedReport.totalExpenses} </span>
                </p>
                <hr />
                <p>
                  <strong>Net Income:</strong>
                  <span className="blue"> ₹{generatedReport.netIncome} </span>
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
