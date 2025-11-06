import React, { useState, useEffect } from "react";
import Transactions from "../pages/transaction";
import Graphs from "../pages/graphs";
import RecordIncome from "../pages/RecordIncome";
import RecordExpense from "../pages/RecordExpense";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [showIncome, setShowIncome] = useState(false);
  const [showExpense, setShowExpense] = useState(false);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch transaction summary
  useEffect(() => {
    fetchSummary();
  }, [refreshTrigger]);

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      // Get current month's date range
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const response = await fetch(
        `http://localhost:5000/api/transactions/summary?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSummary(data.data);
      } else {
        console.error("Failed to fetch summary");
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate savings rate
  const savingsRate = summary.totalIncome > 0 
    ? ((summary.balance / summary.totalIncome) * 100).toFixed(1)
    : 0;

  // Handle successful save
  const handleSaveSuccess = () => {
    setRefreshTrigger(prev => prev + 1); // Trigger refresh
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
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

      {/* Summary Cards */}
      <section className="cards-row">
        <div className="summary-card">
          <h3 className="card-title">Monthly Income</h3>
          <p className="card-value">
            {loading ? "Loading..." : `$${summary.totalIncome.toFixed(2)}`}
          </p>
          <p className="card-footer">Current month total</p>
        </div>
        <div className="summary-card">
          <h3 className="card-title">Monthly Expenses</h3>
          <p className="card-value">
            {loading ? "Loading..." : `$${summary.totalExpense.toFixed(2)}`}
          </p>
          <p className="card-footer">Current month total</p>
        </div>
        <div className="summary-card">
          <h3 className="card-title">Balance</h3>
          <p className="card-value" style={{ 
            color: summary.balance >= 0 ? '#10b981' : '#ef4444' 
          }}>
            {loading ? "Loading..." : `$${summary.balance.toFixed(2)}`}
          </p>
          <p className="card-footer">Income - Expenses</p>
        </div>
        <div className="summary-card">
          <h3 className="card-title">Savings Rate</h3>
          <p className="card-value">
            {loading ? "Loading..." : `${savingsRate}%`}
          </p>
          <p className="card-footer">Of total income</p>
        </div>
      </section>

      {/* Graphs (Side by Side) */}
      <Graphs refreshTrigger={refreshTrigger} />

      {/* Recent Transactions */}
      <section className="transactions-section">
        <h3>Recent Transactions</h3>
        <Transactions refreshTrigger={refreshTrigger} />
      </section>

      {/* Modals */}
      {showIncome && (
        <RecordIncome 
          onClose={() => setShowIncome(false)} 
          onSaveSuccess={handleSaveSuccess}
        />
      )}
      {showExpense && (
        <RecordExpense 
          onClose={() => setShowExpense(false)} 
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
}