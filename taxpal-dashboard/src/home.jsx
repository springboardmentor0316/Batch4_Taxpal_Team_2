import React from "react";
import Transactions from "./transaction";
import Graphs from "./graphs";


export default function Home() {


  return (
    <div>
      <header className="dashboard-header">
        <div>
          <h2>Financial Dashboard</h2>
          <p className="subtitle">Welcome to TaxPal app</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-green">+ Record Income</button>
          <button className="btn btn-red">+ Record Expense</button>
        </div>
      </header>

      <section className="cards-row">
        <div className="card small">
          <div className="card-title">Monthly Income</div>
          <h3 className="card-value">$0.00</h3>
          <div className="card-meta">↑ 10% from last month</div>
        </div>

        <div className="card small">
          <div className="card-title">Monthly Expenses</div>
          <h3 className="card-value">$0.00</h3>
          <div className="card-meta">↑ 8% from last month</div>
        </div>

        <div className="card small">
          <div className="card-title">Bills Due</div>
          <h3 className="card-value">$0.00</h3>
          <div className="card-meta">No upcoming bills</div>
        </div>

        <div className="card small">
          <div className="card-title">Savings Rate</div>
          <h3 className="card-value">0.0%</h3>
          <div className="card-meta">↑ 3.2% from your goal</div>
        </div>
      </section>


      {/* graphs.jsx */}
{/* bar graphs and pie chart */}
      <Graphs/>

{/* transaction.jsx */}
{/* Recent Transactions      */}
      <Transactions/>


      </div>
  );
}
