// File: TaxEstimator.jsx
import React, { useState } from 'react';
import '../styles/TaxEstimator.css';
import { toast } from "react-toastify";

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

  const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingRecord, setExistingRecord] = useState(null);
  const [saving, setSaving] = useState(false);

  // ======= TAX FUNCTIONS (NO CHANGES) ==========
  // function calculateIndiaTax(income) {
  //   if (income <= 300000) return 0;
  //   if (income <= 600000) return (income - 300000) * 0.05;
  //   if (income <= 900000) return 15000 + (income - 600000) * 0.1;
  //   if (income <= 1200000) return 45000 + (income - 900000) * 0.15;
  //   if (income <= 1500000) return 90000 + (income - 1200000) * 0.2;
  //   return 150000 + (income - 1500000) * 0.3;
  // }

  function calculateUSTax(income) {
    if (income <= 11000) return income * 0.1;
    if (income <= 44725) return 1100 + (income - 11000) * 0.12;
    if (income <= 95375) return 5147 + (income - 44725) * 0.22;
    if (income <= 182100) return 16290 + (income - 95375) * 0.24;
    if (income <= 231250) return 37104 + (income - 182100) * 0.32;
    if (income <= 578125) return 52832 + (income - 231250) * 0.35;
    return 174238 + (income - 578125) * 0.37;
  }

  function calculateUKTax(income) {
    if (income <= 12570) return 0;
    if (income <= 50270) return (income - 12570) * 0.2;
    if (income <= 125140) return 7540 + (income - 50270) * 0.4;
    return 7540 + 29948 + (income - 125140) * 0.45;
  }

  // function calculateAustraliaTax(income) {
  //   if (income <= 18200) return 0;
  //   if (income <= 45000) return (income - 18200) * 0.19;
  //   if (income <= 120000) return 5092 + (income - 45000) * 0.325;
  //   if (income <= 180000) return 29467 + (income - 120000) * 0.37;
  //   return 51667 + (income - 180000) * 0.45;
  // }

  function calculateTaxByRegion(region, income) {
    switch (region) {
      // case 'India': return calculateIndiaTax(income);
      case 'United States': return calculateUSTax(income);
      case 'United Kingdom': return calculateUKTax(income);
      // case 'Australia': return calculateAustraliaTax(income);
      default: return income * 0.25;
    }
  }

  const sanitizeNumber = (value) => {
    if (value === null || value === undefined) return 0;
    const cleaned = String(value).replace(/[$, ]+/g, '').trim();
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  const mapCountryCodeToRegion = (countryCode) => {
    if (!countryCode) return 'Unknown';
    const c = countryCode.toLowerCase();
    if (c === 'us' || c === 'usa') return 'United States';
    if (c === 'uk') return 'United Kingdom';
    // if (c === 'au') return 'Australia';
    // if (c === 'in') return 'India';
    return countryCode;
  };

  // calculateTax, saveResult, handleInputChange — unchanged (kept exactly as in original code)
  // ... (for brevity in this canvas the full unchanged functions are included below)

  const calculateTax = async (save = false) => {
    setLoading(true);
    setError('');
    try {
      const grossQuarter = sanitizeNumber(formData.grossIncome);
      const annualIncome = grossQuarter * 4;

      const deductionsSum =
        sanitizeNumber(formData.businessExpenses) +
        sanitizeNumber(formData.retirementContributions) +
        sanitizeNumber(formData.healthInsurance) +
        sanitizeNumber(formData.homeOfficeDeduction);

      const taxable = Math.max(annualIncome - deductionsSum, 0);
      const region = mapCountryCodeToRegion(formData.country);

      const payload = {
        country: formData.country,
        state: formData.state,
        filingStatus: formData.filingStatus,
        quarter: formData.quarter,
        income: grossQuarter,
        annualIncome,
        deductions: {
          businessExpenses: sanitizeNumber(formData.businessExpenses),
          retirementContributions: sanitizeNumber(formData.retirementContributions),
          healthInsurance: sanitizeNumber(formData.healthInsurance),
          homeOfficeDeduction: sanitizeNumber(formData.homeOfficeDeduction)
        }
      };

      let serverResponseJson = null;
      try {
        const url = save ? `${API}/api/tax/save` : `${API}/api/tax/calc`;
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        serverResponseJson = await resp.json().catch(() => null);

        if (resp.ok && serverResponseJson) {
          const normalized = {
            taxable_income: serverResponseJson?.result?.taxable ?? taxable,
            estimated_tax: serverResponseJson?.result?.tax ?? null,
             rawServer: serverResponseJson
          };
          if (normalized.estimated_tax == null) {
            normalized.estimated_tax = calculateTaxByRegion(region, normalized.taxable_income);
          }
          setResult(normalized);
          try {
            const quarter = (payload.quarter || "").toString().toUpperCase();
            const year = new Date().getFullYear();
            if (quarter && quarter.startsWith("Q")) {
              window.dispatchEvent(new CustomEvent("taxCalculated", { detail: { quarter, year } }));
            }
          } catch (e) {
            console.warn("taxCalculated dispatch error", e);
          }
          setLoading(false);
          return;
        } else {
          const serverMsg = (serverResponseJson && (serverResponseJson.message || serverResponseJson.error)) || 'Server calculation failed';
          console.warn('Server responded non-ok:', serverMsg);
        }
          } catch (err) {
        console.warn('Server call failed (falling back to client calc):', err);
        // continue to client-side fallback
      }   

      const clientEstimatedTax = calculateTaxByRegion(region, taxable);
      const normalizedLocal = {
        taxable_income: taxable,
        estimated_tax: clientEstimatedTax,
        rawServer: serverResponseJson
      };
      setResult(normalizedLocal);

      try {
        const quarter = (payload.quarter || "").toString().toUpperCase();
        const year = new Date().getFullYear();
        if (quarter && quarter.startsWith("Q")) {
          window.dispatchEvent(new CustomEvent("taxCalculated", { detail: { quarter, year } }));
        }
      } catch (e) {
        console.warn("taxCalculated dispatch error", e);
      }

    } catch (err) {
      console.error('calculateTax error:', err);
      setError(err.message || 'Failed to calculate tax');
    } finally {
      setLoading(false);
    }
  };

  const saveResult = async () => {
    if (!result) {
      toast.error('No result to save. Calculate first.');
      return;
    }
    const token = localStorage.getItem('token');
  if (!token) {
    // No token -> frontend should ask user to login
    setError('You must be logged in to save. Please login and try again.');
    // optionally redirect: window.location.href = '/login';
    return;
  }
    setSaving(true);
    setError('');
    try {
      try {
        const resp = await fetch(`${API}/api/tax`, { 
          method: 'GET',
          headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
         });
        if (resp.ok) {
          const data = await resp.json().catch(() => null);
          if (Array.isArray(data) && data.length > 0) {
            setExistingRecord(data[0]);
          } else if (data && data._id) {
            setExistingRecord(data);
          }
        }
       else {
        // If 401/403, surface a friendly message
        if (resp.status === 401 || resp.status === 403) {
          throw new Error('Unauthorized. Please login again.');
        }
      }
    } catch (e) {
      // swallow non-fatal GET errors (we continue to save path)
      console.warn('GET existing record failed:', e);
    }

      const payload = {
        annualIncome: result.taxable_income != null ? result.taxable_income + (0) : null,
        deductions: (
          sanitizeNumber(formData.businessExpenses) +
          sanitizeNumber(formData.retirementContributions) +
          sanitizeNumber(formData.healthInsurance) +
          sanitizeNumber(formData.homeOfficeDeduction)
        ),
        taxableIncome: result.taxable_income,
        estimatedQuarterlyTaxes: (result.estimated_tax != null ? result.estimated_tax / 4 : null),
        estimatedTax: result.estimated_tax,
        region: mapCountryCodeToRegion(formData.country),
        status: formData.filingStatus || null
      };

      const url = existingRecord && existingRecord._id
        ? `${API}/api/tax/${existingRecord._id}`
        : `${API}/api/tax/save`;

      const method = existingRecord && existingRecord._id ? 'PUT' : 'POST';

      const resp = await fetch(url, {
        method,
         headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        const j = await resp.json().catch(() => null);
        throw new Error((j && (j.message || j.error)) || resp.statusText || 'Save failed');
      }

      const saved = await resp.json().catch(() => null);
      setExistingRecord(saved || { ...payload });
      setError('');
      toast.success('Saved successfully!');
    } catch (err) {
      console.error('saveResult error', err);
      toast.error(err.message || 'Failed to save result');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="tax-estimator-container">

      <div className="page-header">
        <h1 className="title">Tax Estimator</h1>
        <p className="subtitle">Calculate your estimated tax obligations</p>
      </div>

      <div className="content-grid">

        {/* LEFT CARD */}
        <div className="calculator-card">
          <h2 className="section-heading">Quarterly Tax Calculator</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Country/Region</label>
              <select name="country" value={formData.country} onChange={handleInputChange}>
                <option value="">Select country</option>
                {/* <option value="in">India</option> */}
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                {/* <option value="au">Australia</option> */}
              </select>
            </div>

            <div className="form-group">
              <label>State/Province</label>
              <select name="state" value={formData.state} onChange={handleInputChange}>
                <option value="">Select state</option>
                <option value="ca">California</option>
                <option value="ny">New York</option>
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
                <option value="q1">Q1</option>
                <option value="q2">Q2</option>
                <option value="q3">Q3</option>
                <option value="q4">Q4</option>
              </select>
            </div>
          </div>

          <h3 className="sub-heading">Income</h3>

          <div className="form-group">
            <label>Gross Income for Quarter</label>
            <input type="number" name="grossIncome" value={formData.grossIncome} onChange={handleInputChange}  placeholder="$ 0.00" />
          </div>

          <h3 className="sub-heading">Deductions</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Business Expenses</label>
              <input type="number" name="businessExpenses" value={formData.businessExpenses} onChange={handleInputChange} placeholder="$ 0.00"/>
            </div>

            <div className="form-group">
              <label>Retirement Contributions</label>
              <input type="number" name="retirementContributions" value={formData.retirementContributions} onChange={handleInputChange} placeholder="$ 0.00"/>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Health Insurance Premiums</label>
              <input type="number" name="healthInsurance" value={formData.healthInsurance} onChange={handleInputChange} placeholder="$ 0.00"/>
            </div>

            <div className="form-group">
              <label>Home Office Deduction</label>
              <input type="number" name="homeOfficeDeduction" value={formData.homeOfficeDeduction} onChange={handleInputChange} placeholder="$ 0.00" />
            </div>
          </div>

          <div className="actions-row">

            <button className="btn-calculate primary" onClick={() => calculateTax(false)} 
              // onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
              // onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            >
              {loading ? "Calculating..." : "📊 Calculate Estimated Tax"}
            </button>

            <button className="btn-save" onClick={saveResult} disabled={saving}>
              {saving ? 'Saving...' : '💾 Save Result'}
            </button>
          </div>

          {error && <div className="error-text">{error}</div>}
        </div>

        {/* Right Panel - Summary */}
        <div className="right-panel">
          <div className="summary-card intro">
            <h2 className="summary-heading">Tax Summary</h2>
            <p className="summary-sub">Enter your income and deduction details to calculate your estimated quarterly tax</p>

            {!result && (
              <div className="placeholder-content">
                <div className="calculator-icon">🧮</div>
                <p>Fill in the form and click Calculate to see your estimated tax</p>
              </div>
            )}

            {result && (
              <div className="result-card">
                <div className="result-row"><strong>Taxable Income (annual):</strong> <strong>{result.taxable_income != null ? Number(result.taxable_income).toLocaleString() : '—'}</strong></div>
                <div className="result-row"><strong>Estimated Tax (annual):</strong> <strong>{result.estimated_tax != null ? Number(result.estimated_tax).toLocaleString() : '—'}</strong></div>
                <div className="result-note"><strong>Quarterly estimate: {result.estimated_tax != null ? Math.round(result.estimated_tax / 4).toLocaleString() : '—'}</strong></div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div >
  );
}

