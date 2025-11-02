import React, { useState } from "react";

export default function RecordIncome({ onClose }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  // Handler for form submission (optional, but good practice)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to save the income record here
    console.log({ description, amount, category, date, notes });
    onClose();
  };

  return (
    <div className="modal-overlay">
      {/* The modal-container has the main white background */}
      <div className="modal-container">

        {/* Top Heading Section */}
        <div className="modal-header-top">
          <h2 className="modal-title">Record New Income</h2>
          <button className="close-icon-top" onClick={onClose}>×</button>
        </div>
        <p className="modal-sub">Add details about your income to track your finances better.</p>
        
        {/* Inner Card/Container for the form fields
            This mimics the visual grouping in the screenshot. 
            We'll use a class like 'inner-form-card' to style the background if needed.
        */}
        <div className="inner-form-card">

          {/* Inner Header with 'Add Income' and the mobile icon */}
          <div className="inner-card-header">
            <h3>Add Income</h3>
            {/* The mobile-like icon in the screenshot */}
            <div className="mobile-icon-box">📱</div> 
          </div>

          <form onSubmit={handleSubmit}>
            
            {/* First Row: Description and Amount (Side-by-Side) */}
            <div className="form-row">
              <div className="form-group half">
                <label>Description</label>
                <input placeholder="e.g. Web Design Project" 
                       value={description}
                       onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="form-group half">
                <label>Amount</label>
                <input type="text" placeholder="$ 0.00"
                       value={amount}
                       onChange={(e) => setAmount(e.target.value)} />
              </div>
            </div>

            {/* Second Row: Category and Date (Side-by-Side) */}
            <div className="form-row">
              <div className="form-group half">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
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
      className="date-input"
  />
</div>
</div>

            {/* Notes Field (Full Width) */}
            <div className="form-group full">
              <label>Notes (Optional)</label>
              <textarea placeholder="Add any additional details..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)} />
            </div>

            {/* Button Actions - Inside the 'inner-form-card' and aligned right */}
            <div className="modal-actions-inline">
              <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-save">Save</button>
            </div>
            
          </form>

        </div>
      </div>
    </div>
  );
}