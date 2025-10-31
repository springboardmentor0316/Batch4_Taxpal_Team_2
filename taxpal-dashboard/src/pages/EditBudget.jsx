import React, { useState } from "react";
import "../styles/EditBudget.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";


const EditBudget = ({ onClose }) => {
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState(500);
  const [month, setMonth] = useState("May 2025");
  const [description, setDescription] = useState("Monthly grocery and dining budget");

  return (
    <div className="modal-overlay">
      <div className="edit-modal">
        <div className="edit-modal-header">
          <h3>Edit Budget</h3>
          <FontAwesomeIcon icon={faXmark} className="close-icon" onClick={onClose} />
        </div>

        <p className="subtext">Update your budget details</p>

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
            <div className="input-wrapper">
             <input type="month" value={month} onChange={(e) => setMonth(e.target.value)}/>
            </div>
        </div>
        <div className="form-group description">
          <label>Description (Optional)</label>
          <textarea
            rows="2"
            columns="10"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="button-row">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="update-btn">Update Budget</button>
        </div>
      </div>
    </div>
  );
};

export default EditBudget;