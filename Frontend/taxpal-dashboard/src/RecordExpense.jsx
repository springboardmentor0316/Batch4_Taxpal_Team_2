import React, { useState } from "react";

export default function RecordExpense({ onClose, onSaveSuccess }) {
  // State variables match the Mongoose model fields
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false); // For user feedback

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Get the JWT token from local storage (must be saved there after login)
    const token = localStorage.getItem('token'); 

    if (!token) {
        alert('Authentication error: Please log in again.');
        setLoading(false);
        return;
    }

    // Create the data object matching the Mongoose model
    const expenseData = {
      description,
      amount: parseFloat(amount), // Convert to number for the backend
      category,
      date, // Date string is fine, Mongoose converts it
      notes,
    };

    try {
      const response = await fetch('http://localhost:5000/api/transactions/expense', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            // CRUCIAL: Send the JWT token for authentication middleware
            'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(expenseData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Expense recorded successfully!');
        
        // Call a function passed from the parent to refresh the dashboard list
        if (onSaveSuccess) {
            onSaveSuccess(data.data);
        }
        
        onClose();
      } else {
        alert(`Error recording expense: ${data.error || 'Failed to save.'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Network error. Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        
        <div className="modal-header-top">
          <h2 className="modal-title">Record New Expense</h2>
          <button className="close-icon-top" onClick={onClose}>×</button>
        </div>
        <p className="modal-sub">Add details about your expense to track your spending better.</p>
        
        <div className="inner-form-card">
          <div className="inner-card-header">
            <h3>Add Expense</h3>
            <div className="mobile-icon-box">📱</div> 
          </div>

          <form onSubmit={handleSubmit}>
            
            {/* First Row: Description and Amount (Side-by-Side) */}
            <div className="form-row">
              <div className="form-group half">
                <label>Description</label>
                <input placeholder="e.g. Grocery Shopping" 
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
                  <option>Food</option>
                  <option>Rent/Mortgage</option>
                  <option>Utilities</option>
                  <option>Transportation</option>
                  <option>Shopping</option>
                  <option>Other</option> {/* Added 'Other' to be comprehensive */}
                </select>
              </div>

              <div className="form-group half">
                <label>Date</label>
                {/* Use type="date" for native calendar input if possible, or keep the text/icon setup */}
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

            {/* Button Actions */}
            <div className="modal-actions-inline">
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={onClose}
                disabled={loading} // Disable during loading
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-save"
                disabled={loading} // Disable during loading
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
            
          </form>

        </div>
      </div>
    </div>
  );
}