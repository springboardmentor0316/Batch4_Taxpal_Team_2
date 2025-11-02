import React, { useState } from "react";

export default function RecordIncome({ onClose }) {
  // ... (existing state variables)
  const [loading, setLoading] = useState(false); // <--- ADD THIS

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // <--- Set loading state

    const incomeData = {
      description,
      amount: parseFloat(amount),
      category,
      date,
      notes,
    };

    try {
      // ... (fetch call)

      if (response.ok) {
        alert('Income recorded successfully!');
        onClose();
        // ...
      } else {
        alert(`Error recording income: ${data.error || 'Failed to save.'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Network error. Could not connect to the server (Is backend running on port 5000?).');
    } finally {
      setLoading(false); // <--- Clear loading state after success/failure
    }
  };

  return (
    // ... (modal structure)
      <form onSubmit={handleSubmit}>
        {/* ... (form fields) */}
        <div className="modal-actions-inline">
          <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? 'Saving...' : 'Save'} {/* <--- Update button text */}
          </button>
        </div>
      </form>
    // ...
  );
}