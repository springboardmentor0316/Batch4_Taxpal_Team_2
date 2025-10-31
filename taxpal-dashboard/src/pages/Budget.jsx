import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faFileAlt, faHouse, faSquarePlus, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import "../styles/Budget.css";
import { FaCalculator, FaGear, FaRightFromBracket, FaCircleHalfStroke } from "react-icons/fa6";
import EditBudget from "./EditBudget";
import CreateBudget from "./CreateBudget";
import Logo from "../assets/TaxPal_logo.png";
import ProfileImg from "../assets/profile.jpeg";


const Budget = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleEditClick = () => setIsEditOpen(true);
  const handleCloseEdit = () => setIsEditOpen(false);

  const handleCreateClick = () => setIsCreateOpen(true);
  const handleCloseCreate = () => setIsCreateOpen(false);

  const budgets = [
    { category: "Food", description: "Monthly grocery and dining budget", budget: 500, spent: 250 },
    { category: "Rent/Mortgage", description: "Monthly housing cost", budget: 1200, spent: 800 },
    { category: "Utilities", description: "Electricity, water, internet", budget: 200, spent: 120 },
  ];

  const totalBudget = budgets.reduce((acc, item) => acc + item.budget, 0);
  const totalSpent = budgets.reduce((acc, item) => acc + item.spent, 0);
  const remaining = totalBudget - totalSpent;

  const getProgress = (spent, budget) => (spent / budget) * 100;

  return (
    <>
      <div className={`budget-container ${(isEditOpen || isCreateOpen) ? "blurred" : ""}`}>
        <aside className="sidebar">
          <div>
            <div className="logo">
            <img src={Logo} alt="logo" className="logo_tp" />
              <h2>TaxPal</h2>
            </div>
            <ul>
              <li><FontAwesomeIcon icon={faHouse} /> Dashboard</li>
              <li><FontAwesomeIcon icon={faSquarePlus} /> Transactions</li>
              <li className="active"><FaCircleHalfStroke style={{ color: "white" }} /> Budgets</li>
              <li><FaCalculator style={{color: "white"}} /> Tax Estimator</li>
              <li><FontAwesomeIcon icon={faFileAlt} /> Reports</li>
            </ul>
          </div>
          <div>
            <div className="profile">
                <img src={ProfileImg} alt="Profile" />
              <div className="profile-info">
                <strong>John Doe</strong>
                <small>johndoe@gmail.com</small>
              </div>
            </div>
            <div className="settings">
              <p>Settings <FaGear style={{color:"white" }} /></p>
              <p>Logout <FaRightFromBracket style={{ marginLeft: "2px" }} /></p>
            </div>
          </div>
        </aside>

        <main className="main-content">
          <div className="header">
            <h1>Budget Management</h1>
            <div className="header-right">
              <span className="warning">Warning</span>
              <button className="create-btn" onClick={handleCreateClick}>+ Create Budget</button>
            </div>
          </div>
          <p className="content-text">Track and manage your spending efficiently.</p>

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
                  const progress = getProgress(b.spent, b.budget);
                  const remainingAmount = b.budget - b.spent;
                  return (
                    <tr key={i}>
                      <td>
                        <strong>{b.category}</strong>
                        <br />
                        <small>{b.description}</small>
                      </td>
                      <td>${b.budget.toFixed(2)}</td>
                      <td>${b.spent.toFixed(2)}</td>
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
        </main>
      </div>

      {isEditOpen && <EditBudget onClose={handleCloseEdit} />}
      {isCreateOpen && <CreateBudget onClose={handleCloseCreate} />}
    </>
  );
};

export default Budget;