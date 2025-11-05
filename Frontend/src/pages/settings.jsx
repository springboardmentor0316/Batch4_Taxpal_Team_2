import React, { useState } from "react";
import { FiEdit2, FiX, FiPlus } from "react-icons/fi";
import "../styles/Settings.css";

const initialExpenseCategories = [
  { id: 1, name: "Business Expenses", color: "#ef4444" },
  { id: 2, name: "Office Rent", color: "#3b82f6" },
  { id: 3, name: "Software Subscriptions", color: "#a78bfa" },
  { id: 4, name: "Professional Development", color: "#10b981" },
  { id: 5, name: "Marketing", color: "#f59e0b" },
  { id: 6, name: "Travel", color: "#f472b6" },
];

const initialIncomeCategories = [
  { id: 1, name: "Salary", color: "#06b6d4" },
  { id: 2, name: "Freelance", color: "#60a5fa" },
  { id: 3, name: "Investments", color: "#34d399" },
];

export default function Settings() {
  const [panel, setPanel] = useState("profile");
  const [tab, setTab] = useState("expense");
  const [expenseCategories, setExpenseCategories] = useState(initialExpenseCategories);
  const [incomeCategories, setIncomeCategories] = useState(initialIncomeCategories);

  const removeCategory = (id, type) => {
    if (type === "expense") setExpenseCategories(prev => prev.filter(c => c.id !== id));
    else setIncomeCategories(prev => prev.filter(c => c.id !== id));
  };

  const editCategory = (id, type) => {
    const name = prompt("Edit category name:");
    if (!name) return;
    if (type === "expense") setExpenseCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
    else setIncomeCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
  };

  const addCategory = (type) => {
    const name = prompt("Enter new category name:");
    if (!name) return;
    const newCat = { id: Date.now(), name, color: "#94a3b8" };
    if (type === "expense") setExpenseCategories(prev => [...prev, newCat]);
    else setIncomeCategories(prev => [...prev, newCat]);
  };

  const categories = tab === "expense" ? expenseCategories : incomeCategories;

  return (
    <div className="settings-page">
      <div className="card">
        <div className="settings-header">
          <h1>Settings</h1>
          <p className="muted">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="settings-wrap">
        <div className="settings-left">
          <div className="profile-nav">
            <div className={`profile-item ${panel === "profile" ? "active" : ""}`} onClick={() => setPanel("profile")}>Profile</div>
            <div className={`profile-item ${panel === "categories" ? "active" : ""}`} onClick={() => setPanel("categories")}>Categories</div>
            <div className={`profile-item ${panel === "notifications" ? "active" : ""}`} onClick={() => setPanel("notifications")}>Notifications</div>
            <div className={`profile-item ${panel === "security" ? "active" : ""}`} onClick={() => setPanel("security")}>Security</div>
          </div>
        </div>

        <div className="card settings-card">
          <div className="settings-right">
            <h2>Category Management</h2>

            <div className="tabs">
              <button className={`tab ${tab === "expense" ? "active" : ""}`} onClick={() => setTab("expense")}>Expense Categories</button>
              <button className={`tab ${tab === "income" ? "active" : ""}`} onClick={() => setTab("income")}>Income Categories</button>
            </div>

            <div className="category-list">
              {categories.map(cat => (
                <div key={cat.id} className="category-row">
                  <div className="cat-left">
                    <span className="dot" style={{ background: cat.color }} />
                    <div className="cat-name">{cat.name}</div>
                  </div>
                  <div className="cat-actions">
                    <button className="icon-btn" onClick={() => editCategory(cat.id, tab)}><FiEdit2 /></button>
                    <button className="icon-btn" onClick={() => removeCategory(cat.id, tab)}><FiX /></button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && <div className="empty">No categories</div>}
            </div>

            <button className="add-btn" onClick={() => addCategory(tab)}>
              <FiPlus /> Add New Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}