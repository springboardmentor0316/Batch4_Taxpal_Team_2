// EditBudget.jsx
import React, { useState, useEffect } from "react";
import "../styles/EditBudget.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const toMonthInputValue = (v) => {
  // accepts "May 2025" or "2025-05" or Date -> returns "YYYY-MM"
  if (!v) {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }
  if (typeof v === "string") {
    // already in yyyy-mm?
    if (/^\d{4}-\d{2}$/.test(v)) return v;
    // maybe "May 2025"
    const parsed = Date.parse(v);
    if (!Number.isNaN(parsed)) {
      const d = new Date(parsed);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    }
    // try to parse "May 2025" manually
    const m = v.split(" ");
    if (m.length === 2) {
      const monthName = m[0];
      const year = parseInt(m[1], 10);
      const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      const idx = months.findIndex(mm => mm.toLowerCase().startsWith(monthName.toLowerCase()));
      if (idx >= 0 && !Number.isNaN(year)) {
        return `${year}-${String(idx+1).padStart(2, "0")}`;
      }
    }
  }
  return v;
};

const EditBudget = ({ budgetId = null, initialData = {}, onClose, onSaveSuccess }) => {
  // initialData may contain category, amount, month, description
  const [category, setCategory] = useState(initialData.category || "Food");
  const [amount, setAmount] = useState(initialData.amount ?? 500);
  const [month, setMonth] = useState(toMonthInputValue(initialData.month));
  const [description, setDescription] = useState(initialData.description || "Monthly grocery and dining budget");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // keep local state in sync if initialData changes
  useEffect(() => {
    setCategory(initialData.category || "Food");
    setAmount(initialData.amount ?? 500);
    setMonth(toMonthInputValue(initialData.month));
    setDescription(initialData.description || "");
  }, [initialData]);

  const validate = () => {
    setError("");
    if (!category) {
      setError("Category is required.");
      return false;
    }
    const n = Number(amount);
    if (Number.isNaN(n) || n <= 0) {
      setError("Please enter a valid positive amount.");
      return false;
    }
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      setError("Please choose a valid month.");
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    if (!budgetId) {
      setError("Missing budget id — cannot update. Provide `budgetId` prop.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const payload = {
        category,
        amount: Number(amount),
        month, // "YYYY-MM"
        description,
      };
      const url = `http://localhost:5000/api/budgets/${budgetId}`; // <-- log this
    console.log("PUT request to:", url, "payload:", payload);

      const response = await fetch( url , {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

       // better logging for debugging
    const text = await response.text();
    let body;
    try { body = JSON.parse(text); } catch(e) { body = text; }

    console.log("Response status:", response.status, "body:", body);

    if (!response.ok) {
      // show server message if present
      const serverMsg = body?.message || body || `Status ${response.status}`;
      throw new Error(serverMsg);
    }

    const data = body; // parsed JSON
      // call parent callback if provided to refresh list
      if (typeof onSaveSuccess === "function") onSaveSuccess(data);

      // optionally close the modal
      if (typeof onClose === "function") onClose();

    } catch (err) {
      console.error("Update budget error:", err);
      setError(err.message || "Failed to update budget.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="edit-modal">
        <div className="edit-modal-header">
          <h3>Edit Budget</h3>
          <FontAwesomeIcon icon={faXmark} className="close-icon" onClick={onClose} />
        </div>

        <p className="subtext">Update your budget details</p>

        {error && <div className="form-error" style={{ color: "#b91c1c", marginBottom: 8 }}>{error}</div>}

        <div className="form-grid">
          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Food</option>
              <option>Rent/Mortgage</option>
              <option>Utilities</option>
              <option>Transport</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Budget Amount</label>
            <div className="input-wrapper">
              <span className="currency">$</span>
              <input
                type="number"
                value={amount}
                min="0"
                step="0.01"
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-group month">
          <label>Month</label>
          <div className="input-wrapper">
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              />
          </div>
        </div>

        <div className="form-group description">
          <label>Description (Optional)</label>
          <textarea
            rows="2"
            cols="10"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="button-row">
          <button className="cancel-btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="update-btn"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Budget"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBudget;
