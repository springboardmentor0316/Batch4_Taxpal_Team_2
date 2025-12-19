import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Transactions from "../pages/transaction";
import Graphs from "../pages/graphs";
import RecordIncome from "../pages/RecordIncome";
import RecordExpense from "../pages/RecordExpense";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const location = useLocation();
  const [showIncome, setShowIncome] = useState(false);
  const [showExpense, setShowExpense] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Compute month boundaries
  const { startOfMonthISO, endOfMonthISO } = useMemo(() => {
    const now = new Date();
    const startOfMonthLocal = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const endOfMonthLocal = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    return {
      startOfMonthISO: startOfMonthLocal.toISOString(),
      endOfMonthISO: endOfMonthLocal.toISOString(),
    };
  }, []);

  useEffect(() => {
    setViewAll(false);
  }, [location.pathname]);

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger, startOfMonthISO, endOfMonthISO]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setSummary({ totalIncome: 0, totalExpense: 0, balance: 0 });
        setLoading(false);
        return;
      }

      const url = `http://localhost:5000/api/transactions/summary?startDate=${encodeURIComponent(
        startOfMonthISO
      )}&endDate=${encodeURIComponent(endOfMonthISO)}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json().catch(() => null);

      if (data && data.success) {
        setSummary(data.data || { totalIncome: 0, totalExpense: 0, balance: 0 });
      } else {
        setSummary(data?.data ?? { totalIncome: 0, totalExpense: 0, balance: 0 });
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
      setSummary({ totalIncome: 0, totalExpense: 0, balance: 0 });
    } finally {
      setLoading(false);
    }
  };

  const savingsRate =
    summary.totalIncome > 0
      ? ((summary.balance / summary.totalIncome) * 100).toFixed(1)
      : 0;

  const handleSaveSuccess = () => setRefreshTrigger((prev) => prev + 1);

  if (viewAll) {
   return (
  <div className="dashboard-container">
    <button className="btn btn-green" onClick={() => setViewAll(false)} style={{ marginBottom: "20px" }}>
      ← Back to Dashboard
    </button>
    <Transactions
      refreshTrigger={refreshTrigger}
      isDashboardView={false}
      insideDashboard={true}   // 👈 IMPORTANT FIX
      startDate={startOfMonthISO}
      endDate={endOfMonthISO}
    />
  </div>
);

  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h2>Financial Dashboard</h2>
          <p className="subtitle">Welcome to TaxPal app</p>
        </div>

        <div className="header-actions">
          <button className="btn btn-green" onClick={() => setShowIncome(true)}>
            + Record Income
          </button>
          <button className="btn btn-red" onClick={() => setShowExpense(true)}>
            + Record Expense
          </button>
        </div>
      </header>

      <section className="cards-row">
        <div className="summary-card">
          <h3 className="card-title">Monthly Income</h3>
          <p className="card-value">
            {loading ? "Loading..." : `$${Number(summary.totalIncome || 0).toFixed(2)}`}
          </p>
        </div>
        <div className="summary-card">
          <h3 className="card-title">Monthly Expenses</h3>
          <p className="card-value">
            {loading ? "Loading..." : `$${Number(summary.totalExpense || 0).toFixed(2)}`}
          </p>
        </div>
        <div className="summary-card">
          <h3 className="card-title">Balance</h3>
          <p
            className="card-value"
            style={{ color: (summary.balance || 0) >= 0 ? "#10b981" : "#ef4444" }}
          >
            {loading ? "Loading..." : `$${Number(summary.balance || 0).toFixed(2)}`}
          </p>
        </div>
        <div className="summary-card">
          <h3 className="card-title">Savings Rate</h3>
          <p className="card-value">{loading ? "Loading..." : `${savingsRate}%`}</p>
        </div>
      </section>

      <Graphs refreshTrigger={refreshTrigger} startDate={startOfMonthISO} endDate={endOfMonthISO} />

      {/* full-width wrapper to align transactions with page gutters */}
      <div className="full-width-row">
        <section className="transactions-section">
          <Transactions
            refreshTrigger={refreshTrigger}
            isDashboardView={true}
            onViewAllClick={() => setViewAll(true)}
            startDate={startOfMonthISO}
            endDate={endOfMonthISO}
          />
        </section>
      </div>

      {showIncome && <RecordIncome onClose={() => setShowIncome(false)} onSaveSuccess={handleSaveSuccess} />}
      {showExpense && <RecordExpense onClose={() => setShowExpense(false)} onSaveSuccess={handleSaveSuccess} />}
    </div>
  );
}
