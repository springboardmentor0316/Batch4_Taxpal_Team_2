import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './component/Sidebar';
import Dashboard from './component/Dashboard';
import Transactions from './component/Transactions';
import Budgets from './component/Budgets';
import TaxEstimator from './component/TaxEstimator';
import TaxCalendar from './component/TaxCalendar';
import Reports from './component/Reports';
import Settings from './component/Settings';
import './styles/App.css';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/tax-estimator" element={<TaxEstimator />} />
          <Route path="/tax-calendar" element={<TaxCalendar />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;