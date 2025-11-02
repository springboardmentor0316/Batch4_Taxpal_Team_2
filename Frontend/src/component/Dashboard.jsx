import React from 'react';

export default function Dashboard() {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
        Dashboard
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Welcome to your TaxPal dashboard
      </p>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <p>Dashboard content coming soon...</p>
      </div>
    </div>
  );
}