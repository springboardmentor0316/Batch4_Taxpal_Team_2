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
import "../styles/sidebar.css";

const items = [
  { to: "/", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/transactions", label: "Transactions", icon: <FaExchangeAlt /> },
  { to: "/budgets", label: "Budgets", icon: <FaRegChartBar /> },
  { to: "/tax-estimator", label: "Tax Estimator", icon: <FaFileInvoiceDollar /> },
  { to: "/tax-calendar", label: "Tax Calendar", icon: <FaCalendarAlt /> },
  { to: "/reports", label: "Reports", icon: <FaFolderOpen /> },
];

export default function Sidebar() {
  const handleLogout = () => {
    console.log("Logging out...");
    // Add your logout logic here
  };

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <div className="app-name">
          <div className="logo">TP</div>
          <h1>TaxPal</h1>
        </div>

        <nav className="nav" aria-label="Main navigation">
          <ul className="menu">
            {items.map((it) => (
              <li key={it.to}>
                <NavLink
                  to={it.to}
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  <span className="icon" aria-hidden="true">
                    {it.icon}
                  </span>
                  <span className="label">{it.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="profile-section">
        <div className="profile-header">
          <div className="profile-img">TP</div>
          <div className="profile-name">TaxPal</div>
        </div>
        <div className="profile-actions">
          <NavLink to="/settings" className="action-link">
            <FaCog />
            <span>Settings</span>
          </NavLink>
          <button onClick={handleLogout} className="action-link logout-btn">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}