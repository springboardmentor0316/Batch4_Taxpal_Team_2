
import React, { useState } from "react";
import Transactions from "../pages/transaction";
import Graphs from "../pages/graphs";
import RecordIncome from "../pages/RecordIncome";
import RecordExpense from "../pages/RecordExpense";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [showIncome, setShowIncome] = useState(false);
  const [showExpense, setShowExpense] = useState(false);

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
          <p className="card-value">$0.00</p>
          <p className="card-footer">↑ 10% from last month</p>
        </div>
        <div className="summary-card">
          <h3 className="card-title">Monthly Expenses</h3>
          <p className="card-value">$0.00</p>
          <p className="card-footer">↓ 8% from last month</p>
        </div>
        <div className="summary-card">
          <h3 className="card-title">Bills Due</h3>
          <p className="card-value">$0.00</p>
          <p className="card-footer">No upcoming bills</p>
        </div>
        <div className="summary-card">
          <h3 className="card-title">Savings Rate</h3>
          <p className="card-value">0.0%</p>
          <p className="card-footer">↑ 3.2% from your goal</p>
        </div>
      </section>

      {/* Graphs (Side by Side) */}
      <Graphs />

      {/* Recent Transactions */}
      <section className="transactions-section">
        <h3>Recent Transactions</h3>
        <Transactions />
      </section>

      {/* Modals */}
      {showIncome && <RecordIncome onClose={() => setShowIncome(false)} />}
      {showExpense && <RecordExpense onClose={() => setShowExpense(false)} />}
    </div>
  );
}
