import React, { useState, useEffect } from 'react';
import '../styles/TaxEstimator.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

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

  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const API = window.API || process.env.REACT_APP_API || 'http://localhost:5000';

  // ---------------- TAX FUNCTIONS ----------------
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

  // ---------------- Utilities ----------------
  const sanitizeNumber = (value) => {
    if (!value && value !== 0) return 0;
    const cleaned = String(value).replace(/[$, ]+/g, '').trim();
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ---------------- calculateTax with validation ----------------
  const calculateTax = () => {
    setLoading(true);
    setError('');

    try {
      // validation: require country and grossIncome > 0
      const grossQuarter = sanitizeNumber(formData.grossIncome);
      if (!formData.country) {
        const msg = 'Please select a country/region.';
        setError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }
      if (grossQuarter <= 0) {
        const msg = 'Please enter a valid gross income greater than 0.';
        setError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }

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

      const normalized = {
        taxable_income: taxable,
        estimated_tax: estimatedTax
      };

      setResult(normalized);
    } catch (err) {
      setError('Failed to calculate tax.');
      toast.error('Failed to calculate tax.');
    } finally {
      setLoading(false);
    }
  };

  // ---------------- History loader + save + delete ----------------
  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API}/api/tax/history`, { headers });
      if (!res.ok) {
        console.warn('Failed to fetch tax history', res.status);
        setHistory([]);
      } else {
        const j = await res.json().catch(() => null);
        const items = Array.isArray(j) ? j : (j?.data || []);
        setHistory(items || []);
      }
    } catch (err) {
      console.error('loadHistory error', err);
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveResult = async () => {
    if (!result) {
      toast.error('No result to save. Calculate first.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to save. Please login and try again.');
      toast.error('You must be logged in to save. Please login and try again.');
      return;
    }

    setSaving(true);
    setError('');

    // Compute deductions more reliably (annual - taxable)
    const inputAnnualIncome = sanitizeNumber(formData.grossIncome) * 4;
    const computedDeductions = Math.max(0, inputAnnualIncome - result.taxable_income);

    const payload = {
      annualIncome: inputAnnualIncome,
      taxableIncome: result.taxable_income,
      deductions: computedDeductions,
      estimatedTax: result.estimated_tax,
      estimatedQuarterlyTaxes: Math.round((result.estimated_tax || 0) / 4),
      region: formData.country || '',
      status: formData.filingStatus || ''   // <--- include filingStatus so saved rows have status
    };

    try {
      const resp = await fetch(`${API}/api/tax/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const jText = await resp.text().catch(() => '');
      let j = null;
      try { j = jText ? JSON.parse(jText) : null; } catch { j = null; }

      console.log('[saveResult] status', resp.status, 'body', j || jText);

      if (resp.ok) {
        toast.success(j?.message || 'Saved successfully!');
        await loadHistory();
        return;
      } else {
        const serverMsg = j?.error || j?.message || jText || `Server error (${resp.status})`;
        toast.error(serverMsg);
        setError(serverMsg);
      }
    } catch (err) {
      console.error('[saveResult] error', err);
      toast.error('Network error: failed to save.');
      setError(err.message || 'Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRecord = async (id) => {
    if (!id) return;
    const confirmed = window.confirm("Do you really want to delete this saved tax record?");
    if (!confirmed) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to delete records.');
      return;
    }

    try {
      const resp = await fetch(`${API}/api/tax/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const j = await resp.json().catch(() => null);
      if (resp.ok) {
        toast.success(j?.message || 'Deleted successfully');
        await loadHistory();
      } else {
        toast.error(j?.message || 'Delete failed');
      }
    } catch (err) {
      console.error('delete error', err);
      toast.error('Delete failed due to network or server error');
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

  return (
    <div className="tax-estimator-container">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="page-header">
        <h1 className="title">Tax Estimator</h1>
        <p className="subtitle">Calculate your estimated tax obligations</p>
      </div>

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
            <button className="btn-calculate primary" onClick={calculateTax} disabled={loading}>
              {loading ? "Calculating..." : "📊 Calculate Estimated Tax"}
            </button>

            <button
              className="btn-save"
              onClick={saveResult}
              disabled={!result || saving}
              title={!result ? "Calculate first to save" : "Save result"}
            >
              {saving ? 'Saving...' : '💾 Save Result'}
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
      </div>

      <div className="history-section ">
        <div className="history-inner">
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
                    <tr key={record._id || record.id || record.createdAt}>
                      <td>{record.createdAt ? new Date(record.createdAt).toLocaleDateString() : '—'}</td>
                      <td>{(record.annualIncome || record.annualIncome === 0) ? Number(record.annualIncome).toLocaleString() : '—'}</td>
                      <td>{(record.taxableIncome || record.taxableIncome === 0) ? Number(record.taxableIncome).toLocaleString() : '—'}</td>
                      <td>{(record.deductions || record.deductions === 0) ? Number(record.deductions).toLocaleString() : '—'}</td>
                      <td>{(record.estimatedTax || record.estimatedTax === 0) ? Number(record.estimatedTax).toLocaleString() : '—'}</td>
                      <td>{(record.estimatedQuarterlyTaxes || record.estimatedQuarterlyTaxes === 0) ? Number(record.estimatedQuarterlyTaxes).toLocaleString() : '—'}</td>
                      <td>{record.region || record.country || '—'}</td>
                      <td>{record.status || '—'}</td>
                      <td>
                        <button
                          className="history-delete-btn"
                          title="Delete saved record"
                          onClick={() => handleDeleteRecord(record._id || record.id)}
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
