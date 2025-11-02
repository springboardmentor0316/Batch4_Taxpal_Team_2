import React, { useState } from "react";
import Transactions from "./transaction";
import Graphs from "./graphs";

import RecordIncome from "./RecordIncome";
import RecordExpense from "./RecordExpense";

export default function Home() {

  const [showIncome, setShowIncome] = useState(false);
  const [showExpense, setShowExpense] = useState(false);

  return (
    <div>
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

      <section className="cards-row">
        {/* cards */}
      </section>

      <Graphs />
      <Transactions />

      {showIncome && (
        <RecordIncome onClose={() => setShowIncome(false)} />
      )}

      {showExpense && (
        <RecordExpense onClose={() => setShowExpense(false)} />
      )}
    </div>
  );
}
