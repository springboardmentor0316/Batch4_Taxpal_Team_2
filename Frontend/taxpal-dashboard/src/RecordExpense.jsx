import React, { useState } from "react";

export default function RecordExpense({ onClose }) {

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div className="modal-overlay">
      <div className="modal-container">

        <h2 className="modal-title">Record New Expense</h2>
        <p className="modal-sub">Add details about your expense to track your spending better.</p>

        <div className="inner-card">

          <div className="inner-card-header">
            <h3>Add Expense</h3>
            <button className="close-icon" onClick={onClose}>×</button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Description</label>
              <input placeholder="e.g. Grocery Shopping"
                value={description}
                onChange={(e)=>setDescription(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input type="number" placeholder="$ 0.00"
                value={amount}
                onChange={(e)=>setAmount(e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e)=>setCategory(e.target.value)}>
                <option>Select a category</option>
                <option>Food</option>
                <option>Rent/Mortgage</option>
                <option>Utilities</option>
                <option>Transportation</option>
                <option>Shopping</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input type="date"
                value={date}
                onChange={(e)=>setDate(e.target.value)} />
            </div>
          </div>

          <div className="form-group full">
            <label>Notes (Optional)</label>
            <textarea placeholder="Add any additional details..."
              value={notes}
              onChange={(e)=>setNotes(e.target.value)} />
          </div>

          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-save">Save</button>
          </div>

        </div>

      </div>
    </div>
  );
}
