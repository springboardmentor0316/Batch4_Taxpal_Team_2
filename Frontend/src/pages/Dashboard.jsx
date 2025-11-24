import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    setViewAll(false); // ✅ Return to dashboard whenever page route changes
  }, [location.pathname]);

  useEffect(() => {
    fetchSummary();
  }, [refreshTrigger]);

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const now = new Date();
      const startOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
      const startOfNextMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));

      const response = await fetch(
        `http://localhost:5000/api/transactions/summary?startDate=${startOfMonth.toISOString()}&endDate=${startOfNextMonth.toISOString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await response.json();
      setSummary(data.data || { totalIncome: 0, totalExpense: 0, balance: 0 });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const savingsRate =
    summary.totalIncome > 0
      ? ((summary.balance / summary.totalIncome) * 100).toFixed(1)
      : 0;

  const handleSaveSuccess = () => setRefreshTrigger(prev => prev + 1);

  // ✅ FULL TRANSACTION VIEW
  if (viewAll) {
    return (
      <div className="dashboard-container">
        <button className="btn btn-green" onClick={() => setViewAll(false)} style={{ marginBottom: "20px" }}>
          ← Back to Dashboard
        </button>
        <Transactions refreshTrigger={refreshTrigger} isDashboardView={false} />
      </div>
    );
  }

  // ✅ DASHBOARD VIEW
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h2>Financial Dashboard</h2>
          <p className="subtitle">Welcome to TaxPal app</p>
        </div>

        <div className="header-actions">
          <button className="btn btn-green" onClick={() => setShowIncome(true)}>+ Record Income</button>
          <button className="btn btn-red" onClick={() => setShowExpense(true)}>+ Record Expense</button>
        </div>
      </header>

      {/* Summary Cards */}
      <section className="cards-row">
        <div className="summary-card"><h3 className="card-title">Monthly Income</h3><p className="card-value">{loading ? "Loading..." : `$${summary.totalIncome.toFixed(2)}`}</p></div>
        <div className="summary-card"><h3 className="card-title">Monthly Expenses</h3><p className="card-value">{loading ? "Loading..." : `$${summary.totalExpense.toFixed(2)}`}</p></div>
        <div className="summary-card"><h3 className="card-title">Balance</h3><p className="card-value" style={{ color: summary.balance >= 0 ? "#10b981" : "#ef4444" }}>{loading ? "Loading..." : `$${summary.balance.toFixed(2)}`}</p></div>
        <div className="summary-card"><h3 className="card-title">Savings Rate</h3><p className="card-value">{loading ? "Loading..." : `${savingsRate}%`}</p></div>
      </section>

      <Graphs refreshTrigger={refreshTrigger} />

      {/* Recent Transactions preview */}
      <section className="transactions-section" >
        <Transactions 
          refreshTrigger={refreshTrigger}
          isDashboardView={true}
          onViewAllClick={() => setViewAll(true)} // ✅ OPEN FULL PAGE
        />
      </section>

      {showIncome && <RecordIncome onClose={() => setShowIncome(false)} onSaveSuccess={handleSaveSuccess} />}
      {showExpense && <RecordExpense onClose={() => setShowExpense(false)} onSaveSuccess={handleSaveSuccess} />}
    </div>
  );
}
