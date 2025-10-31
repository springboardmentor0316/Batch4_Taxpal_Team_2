import React, { useState } from "react";
import "../styles/EditBudget.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const CreateBudget = ({ onClose }) => {
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [description, setDescription] = useState("");

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
            <div className="input-wrapper">
             <input type="month" value={month} onChange={(e) => setMonth(e.target.value)}/>
            </div>
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
          <button className="update-btn">Create Budget</button>
        </div>
      </div>
    </div>
  );
};

export default CreateBudget;