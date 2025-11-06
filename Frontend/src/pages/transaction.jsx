import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Transaction.css";

export default function Transactions({ refreshTrigger }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentTransactions();
  }, [refreshTrigger]); // Refetch when refreshTrigger changes

  const fetchRecentTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/transactions/recent?limit=5",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.data);
      } else {
        console.error("Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAmount = (amount, type) => {
    const formattedAmount = `$${amount.toFixed(2)}`;
    return type === "income" ? `+${formattedAmount}` : `-${formattedAmount}`;
  };

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
        <h3>Recent Transactions</h3>
        <Link to="/transactions" className="view-all-link">
          View All
        </Link>
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
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{formatDate(transaction.date)}</td>
                <td>{transaction.description}</td>
                <td>{transaction.category}</td>
                <td
                  className={
                    transaction.type === "income"
                      ? "amount-positive"
                      : "amount-negative"
                  }
                >
                  {formatAmount(transaction.amount, transaction.type)}
                </td>
                <td>
                  <span
                    className={`type-badge ${
                      transaction.type === "income" ? "badge-income" : "badge-expense"
                    }`}
                  >
                    {transaction.type.charAt(0).toUpperCase() +
                      transaction.type.slice(1)}
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