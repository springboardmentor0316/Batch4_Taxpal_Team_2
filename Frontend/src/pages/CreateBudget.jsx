import React, { useState } from "react";
import "../styles/EditBudget.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const CreateBudget = ({ onClose, onSaveSuccess }) => {
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateBudget = async () => {
    if (!amount || !month) {
      alert("Budget Amount and Month are required.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category,
          amount: Number(amount),
          month, // Already in yyyy-mm format
          description,
        }),
      });

   const result = await res.json();
console.log("Budget Create Response:", result); // ✅ Show real backend error

if (res.ok) {
  onSaveSuccess();
  onClose();
} else {
  alert(result.error || result.message || "Failed to create budget.");
}

    } catch (err) {
      console.error("Error:", err);
      alert("Server error. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="edit-modal">

        <div className="edit-modal-header">
          <h3>Create Budget</h3>
          <FontAwesomeIcon icon={faXmark} className="close-icon" onClick={onClose} />
        </div>

        <p className="subtext">Enter new budget details</p>

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
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-group month">
          <label>Month</label>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)}   required />
        </div>

        <div className="form-group description">
          <label>Description (Optional)</label>
          <textarea
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="button-row">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="update-btn" onClick={handleCreateBudget} disabled={loading}>
            {loading ? "Saving..." : "Create Budget"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateBudget;
