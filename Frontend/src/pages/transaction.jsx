import React, { useState, useEffect } from "react";
import "../styles/Transaction.css";

export default function Transactions({ refreshTrigger, isDashboardView, onViewAllClick }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [refreshTrigger]);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const endpoint = isDashboardView
        ? "http://localhost:5000/api/transactions/recent?limit=5"
        : "http://localhost:5000/api/transactions"; // Fetch ALL when not dashboard view

      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatAmount = (amount, type) =>
    `${type === "income" ? "+" : "-"}$${amount.toFixed(2)}`;

  if (loading) {
    return (
      <div className="transactions-container">
        <p style={{ textAlign: "center", padding: "20px" }}>Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="transactions-container">
        <p style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>
          No transactions yet. Start by recording your first income or expense!
        </p>
      </div>
    );
  }

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <h3>{isDashboardView ? "Recent Transactions" : "All Transactions"}</h3>

        {isDashboardView && (
          <button className="view-all-link" onClick={onViewAllClick}>
            View All
          </button>
        )}
      </div>

      <div className="transactions-table">
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
            {transactions.map((t) => (
              <tr key={t._id}>
                <td>{formatDate(t.date)}</td>
                <td>{t.description}</td>
                <td>{t.category}</td>
                <td className={t.type === "income" ? "amount-positive" : "amount-negative"}>
                  {formatAmount(t.amount, t.type)}
                </td>
                <td>
                  <span className={`type-badge ${t.type === "income" ? "badge-income" : "badge-expense"}`}>
                    {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
