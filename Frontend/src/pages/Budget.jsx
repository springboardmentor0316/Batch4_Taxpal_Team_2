// Budget.jsx (Final with Create/Edit Toast, Delete unchanged)
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

  const [selectedBudget, setSelectedBudget] = useState(null);

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

  // OPEN edit modal
  const handleEditClick = (budget) => {
    setSelectedBudget(budget);
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedBudget(null);
  };

  const handleCreateClick = () => setIsCreateOpen(true);
  const handleCloseCreate = () => setIsCreateOpen(false);

  // ✅ Toast for Create Budget
  const handleSaveSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    toast.success("Budget created successfully!");
    setIsCreateOpen(false);
  };

  // ✅ Toast for Edit Budget
  const handleEditSaveSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    toast.success("Budget updated successfully!");
    handleCloseEdit();
  };

  // ❌ Delete unchanged (as you told)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/budgets/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setRefreshTrigger((prev) => prev + 1);
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      alert("Error deleting budget");
      console.error(err);
    }
  };

  const totalBudget = budgets.reduce((acc, item) => acc + (item.amount || 0), 0);
  const totalSpent = budgets.reduce((acc, item) => acc + (item.spent || 0), 0);
  const remaining = totalBudget - totalSpent;

  const getProgress = (spent, budget) =>
    budget > 0 ? (spent / budget) * 100 : 0;

  return (
    <>
      {/* 🔥 Correct place to add ToastContainer */}
      <ToastContainer position="top-right" autoClose={2500} />

      <main className={`main-content ${isEditOpen || isCreateOpen ? "blurred" : ""}`}>
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
              <small>
                {totalBudget > 0
                  ? ((totalSpent / totalBudget) * 100).toFixed(1)
                  : "0.0"}
                % of budget
              </small>
            </div>

            <div className="card">
              <h3>Remaining</h3>
              <p className="amount">${remaining.toFixed(2)}</p>
              <small>
                {totalBudget > 0
                  ? ((remaining / totalBudget) * 100).toFixed(1)
                  : "0.0"}
                % remaining
              </small>
            </div>
          </div>

          {/* Budget Table */}
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
                  const progress = getProgress(spent, b.amount || 0);
                  const remainingAmount = (b.amount || 0) - spent;

                  return (
                    <tr key={b._id || i}>
                      <td>
                        <strong>{b.category}</strong>
                        <br />
                        <small>{b.description}</small>
                      </td>

                      <td>${(b.amount || 0).toFixed(2)}</td>
                      <td>${spent.toFixed(2)}</td>
                      <td className="green">${remainingAmount.toFixed(2)}</td>

                      <td>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                        <small>{Math.round(progress)}%</small>
                      </td>

                      <td className="status ontrack">On Track</td>

                      <td className="actions">
                        <button
                          className="edit"
                          onClick={() => handleEditClick(b)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>

                        <button
                          className="delete"
                          onClick={() => handleDelete(b._id)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {budgets.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#6b7280",
                      }}
                    >
                      No budgets yet. Create your first budget.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {isEditOpen && selectedBudget && (
        <EditBudget
          budgetId={selectedBudget._id}
          initialData={selectedBudget}
          onClose={handleCloseEdit}
          onSaveSuccess={handleEditSaveSuccess}
        />
      )}

      {/* Create Modal */}
      {isCreateOpen && (
        <CreateBudget
          onClose={handleCloseCreate}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </>
  );
};

export default Budget;
