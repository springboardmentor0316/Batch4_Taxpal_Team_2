import React, { useState } from 'react';
import '../styles/TaxEstimator.css';

export default function TaxEstimator() {
  const [formData, setFormData] = useState({
    country: '',
    state: '',
    filingStatus: '',
    quarter: '',
    grossIncome: '',
    businessExpenses: '',
    retirementContributions: '',
    healthInsurance: '',
    homeOfficeDeduction: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function calculateIndiaTax(income) {
    if (income <= 300000) return 0;
    if (income <= 600000) return (income - 300000) * 0.05;
    if (income <= 900000) return 15000 + (income - 600000) * 0.1;
    if (income <= 1200000) return 45000 + (income - 900000) * 0.15;
    if (income <= 1500000) return 90000 + (income - 1200000) * 0.2;
    return 150000 + (income - 1500000) * 0.3;
  }

  function indiaStateTax(state, income) {
    if (state === "MH") return 300;
    if (state === "KA") return 200;
    return 0;
  }

  function calculateUSTax(income) {
    if (income <= 11000) return income * 0.1;
    if (income <= 44725) return 1100 + (income - 11000) * 0.12;
    if (income <= 95375) return 5147 + (income - 44725) * 0.22;
    if (income <= 182100) return 16290 + (income - 95375) * 0.24;
    if (income <= 231250) return 37104 + (income - 182100) * 0.32;
    if (income <= 578125) return 52832 + (income - 231250) * 0.35;
    return 174238 + (income - 578125) * 0.37;
  }

  function usStateTax(state, income) {
    if (state === "CA") return income * 0.15;
    if (state === "NY") return income * 0.08;
    return 0;
  }

  function calculateUKTax(income) {
    if (income <= 12570) return 0;
    if (income <= 50270) return (income - 12570) * 0.2;
    if (income <= 125140) return 7540 + (income - 50270) * 0.4;
    return 7540 + 29948 + (income - 125140) * 0.45;
  }

  function ukRegionTax(state, income) {
    if (state === "ENG") return 0;
    if (state === "SCT") return income * 0.01;
    return 0;
  }

  function calculateTaxByCountryAndState(country, state, income) {
    if (country === "in") return calculateIndiaTax(income) + indiaStateTax(state, income);
    if (country === "us") return calculateUSTax(income) + usStateTax(state, income);
    if (country === "uk") return calculateUKTax(income) + ukRegionTax(state, income);
    return income * 0.25;
  }

  const sanitizeNumber = (value) => {
    if (!value) return 0;
    const cleaned = String(value).replace(/[$, ]+/g, '').trim();
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTax = () => {
    setLoading(true);
    setError('');
    try {
      const grossQuarter = sanitizeNumber(formData.grossIncome);
      const annualIncome = grossQuarter * 4;

      const deductions =
        sanitizeNumber(formData.businessExpenses) +
        sanitizeNumber(formData.retirementContributions) +
        sanitizeNumber(formData.healthInsurance) +
        sanitizeNumber(formData.homeOfficeDeduction);

      const taxable = Math.max(annualIncome - deductions, 0);

      const estimatedTax = calculateTaxByCountryAndState(
        formData.country,
        formData.state,
        taxable
      );

      setResult({
        taxable_income: taxable,
        estimated_tax: estimatedTax
      });

    } catch (err) {
      setError('Failed to calculate tax.');
    } finally {
      setLoading(false);
    }
  };

  const countryStates = {
    in: [
      { value: 'MH', label: 'Maharashtra' },
      { value: 'KA', label: 'Karnataka' }
    ],
    us: [
      { value: 'CA', label: 'California' },
      { value: 'NY', label: 'New York' }
    ],
    uk: [
      { value: 'ENG', label: 'England' },
      { value: 'SCT', label: 'Scotland' }
    ]
  };

  const stateOptions = formData.country ? countryStates[formData.country] || [] : [];

  // ----------------- render -----------------
  return (
    <div className="tax-estimator-container">

      {/* Toast container for this page */}
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="page-header">
        <h1 className="title">Tax Estimator</h1>
        <p className="subtitle">Calculate your estimated tax obligations</p>
      </div>

      {/* content-grid: left column (calculator), right column (summary) */}
      <div className="content-grid">

        <div className="calculator-card">
          <h2 className="section-heading">Quarterly Tax Calculator</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Country/Region</label>
              <select name="country" value={formData.country} onChange={handleInputChange}>
                <option value="">Select country</option>
                <option value="in">India</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
              </select>
            </div>

            <div className="form-group">
              <label>State/Province</label>
              <select name="state" value={formData.state} onChange={handleInputChange}>
                <option value="">Select state</option>
                {(stateOptions.length > 0 ? stateOptions : [{ value: '', label: '—' }]).map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Filing Status</label>
              <select name="filingStatus" value={formData.filingStatus} onChange={handleInputChange}>
                <option value="">Select status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
              </select>
            </div>

            <div className="form-group">
              <label>Quarter</label>
              <select name="quarter" value={formData.quarter} onChange={handleInputChange}>
                <option value="">Select quarter</option>
                <option value="q1">Q1 (JAN–MAR)</option>
                <option value="q2">Q2 (APR–JUN)</option>
                <option value="q3">Q3 (JUL–SEP)</option>
                <option value="q4">Q4 (OCT–DEC)</option>
              </select>
            </div>
          </div>

          <h3 className="sub-heading">Income</h3>
          <div className="form-group">
            <label>Gross Income for Quarter</label>
            <input type="number" name="grossIncome" value={formData.grossIncome} onChange={handleInputChange} placeholder="0" />
          </div>

          <h3 className="sub-heading">Deductions</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Business Expenses</label>
              <input type="number" name="businessExpenses" value={formData.businessExpenses} onChange={handleInputChange} placeholder="0" />
            </div>
            <div className="form-group">
              <label>Retirement Contributions</label>
              <input type="number" name="retirementContributions" value={formData.retirementContributions} onChange={handleInputChange} placeholder="0" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Health Insurance Premiums</label>
              <input type="number" name="healthInsurance" value={formData.healthInsurance} onChange={handleInputChange} placeholder="0" />
            </div>
            <div className="form-group">
              <label>Home Office Deduction</label>
              <input type="number" name="homeOfficeDeduction" value={formData.homeOfficeDeduction} onChange={handleInputChange} placeholder="0" />
            </div>
          </div>

          <div className="actions-row">
            <button className="btn-calculate primary" onClick={calculateTax}>
              {loading ? "Calculating..." : "📊 Calculate Estimated Tax"}
            </button>
          </div>

          {error && <div className="error-text">{error}</div>}
        </div>

        <div className="right-panel">
          <div className="summary-card intro">
            <h2 className="summary-heading">Tax Summary</h2>
            <p className="summary-sub">Your estimated quarterly tax will be shown here.</p>

            {!result && (
              <div className="placeholder-content">
                <div className="calculator-icon">🧮</div>
                <p>Fill in the form and click Calculate to see your estimated tax</p>
              </div>
            )}

            {result && (
              <div className="result-card">
                <div className="result-row">
                  <strong>Taxable Income (annual):</strong>
                  <strong>{Number(result.taxable_income).toLocaleString()}</strong>
                </div>
                <div className="result-row">
                  <strong>Estimated Tax (annual):</strong>
                  <strong>{Number(result.estimated_tax).toLocaleString()}</strong>
                </div>
                <div className="result-note">
                  <strong>Quarterly estimate: {Math.round(result.estimated_tax / 4).toLocaleString()}</strong>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ===== History: placed inside the grid and constrained to left column so it sits below the calculator ===== */}
        <div className="history-section left-column">
          <h3 className="summary-heading">📘 Saved Tax Results</h3>
          <p className="summary-sub">Your previously saved tax calculations</p>

          {historyLoading ? (
            <p>Loading history...</p>
          ) : history.length === 0 ? (
            <p>No saved tax results found.</p>
          ) : (
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Annual Income</th>
                    <th>Taxable Income</th>
                    <th>Deductions</th>
                    <th>Estimated Tax</th>
                    <th>Quarterly Tax</th>
                    <th>Region</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(record => (
                    <tr key={record._id}>
                      <td>{new Date(record.createdAt).toLocaleDateString()}</td>
                      <td>${(record.annualIncome || 0).toLocaleString()}</td>
                      <td>${(record.taxableIncome || 0).toLocaleString()}</td>
                      <td>${(record.deductions || 0).toLocaleString()}</td>
                      <td>${(record.estimatedTax || 0).toLocaleString()}</td>
                      <td>${(record.estimatedQuarterlyTaxes || 0).toLocaleString()}</td>
                      <td>{record.region}</td>
                      <td>{record.status || '—'}</td>
                      <td>
                        <button
                          className="history-delete-btn"
                          title="Delete saved record"
                          onClick={() => handleDeleteRecord(record._id)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
