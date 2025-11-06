import React, { useState, useEffect } from "react";
import "../styles/RecordsIE.css";


export default function RecordIncome({ onClose }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    // Prevent body scroll without affecting layout
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ description, amount, category, date, notes });
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container small">
        <div className="modal-header-top">
          <h2 className="modal-title">Record New Income</h2>
          <button className="close-icon-top" onClick={onClose}>×</button>
        </div>
        <p className="modal-sub">Add details about your income to track your finances.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group half">
              <label>Description</label>
              <input 
                placeholder="e.g. Web Design Project"
                value={description}
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>
            <div className="form-group half">
              <label>Amount</label>
              <input 
                type="text" 
                placeholder="$ 0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)} 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Select a category</option>
                <option>Salary</option>
                <option>Freelance</option>
                <option>Consulting</option>
                <option>Investment</option>
              </select>
            </div>
            <div className="form-group half">
              <label>Date</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)} 
              />
            </div>
          </div>

          <div className="form-group full">
            <label>Notes (Optional)</label>
            <textarea 
              placeholder="Add any additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)} 
            />
          </div>

          <div className="modal-actions-inline">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}