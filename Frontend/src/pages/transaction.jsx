import React from "react";
import "../styles/Transactions.css"
function Transactions() {
  const transactions = [
    { date: "May 8, 2025", description: "Design Project", category: "Consulting", amount: "+$1200.00", type: "Income" },
    { date: "May 5, 2025", description: "Grocery Shopping", category: "Food", amount: "-$250.00", type: "Expense" },
    { date: "May 1, 2025", description: "Rent Payment", category: "Rent/Mortgage", amount: "-$800.00", type: "Expense" },
    { date: "Apr 28, 2025", description: "Freelance Work", category: "Freelance", amount: "+$450.00", type: "Income" },
    { date: "Apr 25, 2025", description: "Electricity Bill", category: "Utilities", amount: "-$120.00", type: "Expense" },
  ];

  return (
     <main className="main">
        <div className="card">
          <div className="header">
            <h3>Recent Transactions</h3>
            <a href= "#" >View All</a>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={i}>
                  <td>{t.date}</td>
                  <td>{t.description}</td>
                  <td>{t.category}</td>
                  <td className={t.type === "Income" ? "income" : "expense"}>
                    {t.amount}
                  </td>
                  <td>{t.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
  );
}

export default  Transactions;