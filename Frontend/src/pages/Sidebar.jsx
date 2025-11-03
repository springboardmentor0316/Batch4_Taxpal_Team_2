import React from "react";
import { NavLink } from "react-router-dom";
import { 
  FaTachometerAlt, 
  FaExchangeAlt, 
  FaRegChartBar, 
  FaFileInvoiceDollar,
  FaCalendarAlt,
  FaFolderOpen, 
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";
import '../styles/Sidebar.css';

const items = [
  { to: "/Dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/transactions", label: "Transactions", icon: <FaExchangeAlt /> },
  { to: "/Budget", label: "Budgets", icon: <FaRegChartBar /> },
  { to: "/tax-estimator", label: "Tax Estimator", icon: <FaFileInvoiceDollar /> },
  { to: "/tax-calendar", label: "Tax Calendar", icon: <FaCalendarAlt /> },
  { to: "/reports", label: "Reports", icon: <FaFolderOpen /> },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="logo-section"> 
        <div className="app-name">
          <img src="/assets/images/TaxPal_logo.png" alt="TaxPal Logo" className="logo-img" />
          <h1>TaxPal</h1>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="nav" aria-label="Main navigation">
        <ul className="sidebar-list">
          {items.map((item) => (
            <li key={item.to} className="sidebar-list-item">
              <NavLink
                to={item.to}
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                <span className="icon" aria-hidden="true">{item.icon}</span>
                <span className="label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Profile / Settings Section at the Bottom */}
      <div className="sidebar-bottom">
        <div className="profile">
          <img src="/assets/images/TaxPal_logo.png" alt="TaxPal Logo" className="avathar" />

          <div className="profile-info">
            <div className="profile-name">TaxPal</div>
            <div className="profile-actions">
              <NavLink to="/setting" className="settings-link">
                <FaCog className="settings-icon"/>
                Settings
              </NavLink>
              <button className="logout-link">
                <FaSignOutAlt className="logout-icon"/>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}