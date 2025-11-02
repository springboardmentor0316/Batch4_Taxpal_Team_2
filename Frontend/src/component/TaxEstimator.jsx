import React, { useState } from 'react';

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
        Tax Estimator
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Calculate your estimated tax obligations
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left Panel - Form */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1f2937' }}>
            Quarterly Tax Calculator
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                Country/Region
              </label>
              <select name="country" value={formData.country} onChange={handleInputChange} style={{
                width: '100%',
                padding: '0.625rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem',
                backgroundColor: '#f9fafb'
              }}>
                <option value="">Select country</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                State/Province
              </label>
              <select name="state" value={formData.state} onChange={handleInputChange} style={{
                width: '100%',
                padding: '0.625rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem',
                backgroundColor: '#f9fafb'
              }}>
                <option value="">Select state</option>
                <option value="ca">California</option>
                <option value="ny">New York</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                Filing Status
              </label>
              <select name="filingStatus" value={formData.filingStatus} onChange={handleInputChange} style={{
                width: '100%',
                padding: '0.625rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem',
                backgroundColor: '#f9fafb'
              }}>
                <option value="">Select status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                Quarter
              </label>
              <select name="quarter" value={formData.quarter} onChange={handleInputChange} style={{
                width: '100%',
                padding: '0.625rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem',
                backgroundColor: '#f9fafb'
              }}>
                <option value="">Select quarter</option>
                <option value="q1">Q1</option>
                <option value="q2">Q2</option>
                <option value="q3">Q3</option>
                <option value="q4">Q4</option>
              </select>
            </div>
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem', color: '#1f2937' }}>
            Income
          </h3>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
              Gross Income for Quarter
            </label>
            <input
              type="text"
              name="grossIncome"
              value={formData.grossIncome}
              onChange={handleInputChange}
              placeholder="$ 0.00"
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem',
                backgroundColor: '#f9fafb'
              }}
            />
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginTop: '2rem', marginBottom: '1rem', color: '#1f2937' }}>
            Deductions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                Business Expenses
              </label>
              <input
                type="text"
                name="businessExpenses"
                value={formData.businessExpenses}
                onChange={handleInputChange}
                placeholder="$ 0.00"
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  backgroundColor: '#f9fafb'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                Retirement Contributions
              </label>
              <input
                type="text"
                name="retirementContributions"
                value={formData.retirementContributions}
                onChange={handleInputChange}
                placeholder="$ 0.00"
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  backgroundColor: '#f9fafb'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                Health Insurance Premiums
              </label>
              <input
                type="text"
                name="healthInsurance"
                value={formData.healthInsurance}
                onChange={handleInputChange}
                placeholder="$ 0.00"
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  backgroundColor: '#f9fafb'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                Home Office Deduction
              </label>
              <input
                type="text"
                name="homeOfficeDeduction"
                value={formData.homeOfficeDeduction}
                onChange={handleInputChange}
                placeholder="$ 0.00"
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  backgroundColor: '#f9fafb'
                }}
              />
            </div>
          </div>

          <button style={{
            width: '100%',
            marginTop: '2rem',
            padding: '0.875rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            📊 Calculate Estimated Tax
          </button>
        </div>

        {/* Right Panel - Summary */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          height: 'fit-content'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
            Tax Summary
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '2rem' }}>
            Enter your income and deduction details to calculate your estimated quarterly tax
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '3rem 0',
            color: '#d1d5db'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🧮</div>
              <p style={{ fontSize: '0.875rem' }}>Fill in the form and click Calculate to see your estimated tax</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}