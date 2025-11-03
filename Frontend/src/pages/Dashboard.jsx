import React, { useState } from "react";
// Assuming the paths are correct after your restructure
import Transactions from "../pages/transaction"; 
import Graphs from "../pages/graphs";

import RecordIncome from "../pages/RecordIncome";
import RecordExpense from "../pages/RecordExpense";

// Renamed and assumed to be the main Dashboard component
export default function Dashboard() { 

  const [showIncome, setShowIncome] = useState(false);
  const [showExpense, setShowExpense] = useState(false);

  return (
    // 💡 Added dashboard-container class for main layout styling
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h2>Financial Dashboard</h2>
          <p className="subtitle">Welcome to TaxPal app</p>
        </div>

        <div className="header-actions">
          <button
            className="btn btn-green"
            onClick={() => setShowIncome(true)}
          >
            + Record Income
          </button>

          <button
            className="btn btn-red"
            onClick={() => setShowExpense(true)}
          >
            + Record Expense
          </button>
        </div>
      </header>

      {/* 1. Summary Cards Section - Implements the top row of metrics */}
      <section className="cards-row">
        {/* Monthly Income Card */}
        <div className="summary-card">
          <h3 className="card-title">Monthly Income</h3>
          <p className="card-value">$0.00</p>
          <p className="card-footer">↑ 10% from last month</p>
        </div>
        
        {/* Monthly Expenses Card */}
        <div className="summary-card">
          <h3 className="card-title">Monthly Expenses</h3>
          <p className="card-value">$0.00</p>
          <p className="card-footer">↓ 8% from last month</p>
        </div>
        
        {/* Bills Due Card */}
        <div className="summary-card">
          <h3 className="card-title">Bills Due</h3>
          <p className="card-value">$0.00</p>
          <p className="card-footer">No upcoming bills</p>
        </div>
        
        {/* Savings Rate Card */}
        <div className="summary-card">
          <h3 className="card-title">Savings Rate</h3>
          <p className="card-value">0.0%</p>
          <p className="card-footer">↑ 3.2% from your goal</p>
        </div>
      </section>

      {/* 2. Charts and Data Section - Implements the main two-column grid */}
      <div className="charts-and-data">
        {/* Left column: Main Bar/Line Chart */}
        <div className="graphs-container">
          {/* Note: In the image, this container has a header bar */}
          <h3 className="graph-header-bar">Income vs Expenses</h3>
          <Graphs />
        </div>
        
        {/* Right column: Expense Breakdown Pie Chart / Transactions */}
        <div className="transactions-container">
          {/* You would likely have a specific component for the Expense Breakdown Pie Chart here */}
          <Transactions /> 
        </div>
      </div>
      
      {/* Modals/Overlays for recording data */}
      {showIncome && (
        <RecordIncome onClose={() => setShowIncome(false)} />
      )}

      {showExpense && (
        <RecordExpense onClose={() => setShowExpense(false)} />
      )}
    </div>
  );
}