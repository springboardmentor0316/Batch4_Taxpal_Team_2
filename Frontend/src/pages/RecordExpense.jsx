import React, { useState } from "react";

export default function RecordExpense({ onClose, onSaveSuccess }) {
  // State variables match the Mongoose model fields
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }
    
    if (!category || category === "Select a category") {
      newErrors.category = "Please select a category";
    }
    
    if (!date) {
      newErrors.date = "Date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate before submitting
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    // Get the JWT token from local storage
    const token = localStorage.getItem('token'); 

    if (!token) {
      alert('Authentication error: Please log in again.');
      setLoading(false);
      return;
    }

    // Create the data object matching the Mongoose model
    const expenseData = {
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      date,
      notes: notes.trim(),
    };

    try {
      const response = await fetch('http://localhost:5000/api/transactions/expense', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(expenseData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Expense recorded successfully!');
        
        // Call parent function to refresh the dashboard
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

  // Handle amount input to allow only numbers and decimal
  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow numbers, one decimal point, and up to 2 decimal places
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
      // Clear error when user starts typing
      if (errors.amount) {
        setErrors(prev => ({ ...prev, amount: '' }));
      }
    }
  };

  // Clear error when user updates field
  const handleFieldChange = (field, value) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    switch(field) {
      case 'description':
        setDescription(value);
        break;
      case 'category':
        setCategory(value);
        break;
      case 'date':
        setDate(value);
        break;
      case 'notes':
        setNotes(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        
        <div className="modal-header-top">
          <h2 className="modal-title">Record New Expense</h2>
          <button className="close-icon-top" onClick={onClose} aria-label="Close">×</button>
        </div>
        <p className="modal-sub">Add details about your expense to track your spending better.</p>
        
        <div className="inner-form-card">
          <div className="inner-card-header">
            <h3>Add Expense</h3>
            <div className="mobile-icon-box">📱</div>
          </div>

          <form onSubmit={handleSubmit}>
            
            {/* First Row: Description and Amount */}
            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="description">Description *</label>
                <input 
                  id="description"
                  type="text"
                  placeholder="e.g. Grocery Shopping" 
                  value={description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className={errors.description ? 'error' : ''}
                />
                {errors.description && <span className="error-text">{errors.description}</span>}
              </div>

              <div className="form-group half">
                <label htmlFor="amount">Amount *</label>
                <input 
                  id="amount"
                  type="text" 
                  placeholder="$ 0.00"
                  value={amount}
                  onChange={handleAmountChange}
                  className={errors.amount ? 'error' : ''}
                />
                {errors.amount && <span className="error-text">{errors.amount}</span>}
              </div>
            </div>

            {/* Second Row: Category and Date */}
            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="category">Category *</label>
                <select 
                  id="category"
                  value={category} 
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                  className={errors.category ? 'error' : ''}
                >
                  <option value="">Select a category</option>
                  <option value="Food">Food</option>
                  <option value="Rent/Mortgage">Rent/Mortgage</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && <span className="error-text">{errors.category}</span>}
              </div>

              <div className="form-group half">
                <label htmlFor="date">Date *</label>
                <input 
                  id="date"
                  type="date" 
                  value={date}
                  onChange={(e) => handleFieldChange('date', e.target.value)}
                  max={new Date().toISOString().split('T')[0]} // Prevent future dates
                  className={errors.date ? 'error' : ''}
                />
                {errors.date && <span className="error-text">{errors.date}</span>}
              </div>
            </div>

            {/* Notes Field (Full Width) */}
            <div className="form-group full">
              <label htmlFor="notes">Notes (Optional)</label>
              <textarea 
                id="notes"
                placeholder="Add any additional details..."
                value={notes}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
                rows="3"
              />
            </div>

            {/* Button Actions */}
            <div className="modal-actions-inline">
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-save"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Expense'}
              </button>
            </div>
            
          </form>

        </div>
      </div>
    </div>
  );
}