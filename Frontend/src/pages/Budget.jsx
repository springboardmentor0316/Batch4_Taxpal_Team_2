import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import "../styles/Budget.css";
import EditBudget from "./EditBudget";
import CreateBudget from "./CreateBudget";

const Budget = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch budgets from backend
  useEffect(() => {
    fetchBudgets();
  }, [refreshTrigger]);

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/budgets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setBudgets(data.data || []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  const handleEditClick = () => setIsEditOpen(true);
  const handleCloseEdit = () => setIsEditOpen(false);

  const handleCreateClick = () => setIsCreateOpen(true);
  const handleCloseCreate = () => setIsCreateOpen(false);

  const handleSaveSuccess = () => {
    setRefreshTrigger((prev) => prev + 1); // ✅ Refresh table after creating budget
  };

  const totalBudget = budgets.reduce((acc, item) => acc + item.amount, 0);
  const totalSpent = budgets.reduce((acc, item) => acc + (item.spent || 0), 0);
  const remaining = totalBudget - totalSpent;

  const getProgress = (spent, budget) => (spent / budget) * 100;

  return (
    <>
      {/* 1. Use 'main-content' as the primary container next to the sidebar. 
        2. Apply the 'blurred' class directly here for consistency. 
        3. Remove 'budget-container' if 'main-content' handles layout. 
      */}
      <main className={`main-content ${isEditOpen || isCreateOpen ? "blurred" : ""}`}>
        {/* 4. Replace 'budget-wrapper' with a simple 'budget-container' or 
             remove it completely and let the content start here. 
             If we must keep an inner div, we'll use 'budget-content'
             and remove the problematic 'budget-wrapper' entirely.
        */}
        <div className="budget-content"> 
          <div className="header">
            <h1>Budget Management</h1>
            <div className="header-right">
              <span className="warning">Warning</span>
              <button className="create-btn" onClick={handleCreateClick}>
                + Create Budget
              </button>
            </div>
          </div>
          <p className="content-text">Track and manage your spending efficiently.</p>

          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="card">
              <h3>Total Budget</h3>
              <p className="amount">${totalBudget.toFixed(2)}</p>
              <small>Across all categories</small>
            </div>
            <div className="card">
              <h3>Total Spent</h3>
              <p className="amount">${totalSpent.toFixed(2)}</p>
              <small>{((totalSpent / totalBudget) * 100).toFixed(1)}% of budget</small>
            </div>
            <div className="card">
              <h3>Remaining</h3>
              <p className="amount">${remaining.toFixed(2)}</p>
              <small>{((remaining / totalBudget) * 100).toFixed(1)}% remaining</small>
            </div>
          </div>

          {/* Budgets Table */}
          <div className="budget-table">
            <h3>Your Budgets</h3>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Budget</th>
                  <th>Spent</th>
                  <th>Remaining</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((b, i) => {
                  const spent = b.spent || 0;
                  const progress = getProgress(spent, b.amount);
                  const remainingAmount = b.amount - spent;

                  return (
                    <tr key={i}>
                      <td>
                        <strong>{b.category}</strong>
                        <br />
                        <small>{b.description}</small>
                      </td>
                      <td>${b.amount.toFixed(2)}</td>
                      <td>${spent.toFixed(2)}</td>
                      <td className="green">${remainingAmount.toFixed(2)}</td>
                      <td>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                        <small>{Math.round(progress)}%</small>
                      </td>
                      <td className="status ontrack">On Track</td>
                      <td className="actions">
                        <button className="edit" onClick={handleEditClick}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="delete">
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {isEditOpen && <EditBudget onClose={handleCloseEdit} />}
      {isCreateOpen && <CreateBudget onClose={handleCloseCreate} onSaveSuccess={handleSaveSuccess} />}
    </>
  );
};

export default Budget;