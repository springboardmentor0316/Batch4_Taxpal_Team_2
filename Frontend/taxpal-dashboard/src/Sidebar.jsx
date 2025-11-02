import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaExchangeAlt, FaRegChartBar, FaFileInvoiceDollar, FaFolderOpen } from "react-icons/fa";


const items = [
  { to: "/", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/transactions", label: "Transactions", icon: <FaExchangeAlt /> },
  { to: "/Budget", label: "Budgets", icon: <FaRegChartBar /> },
  { to: "/tax-estimator", label: "Tax Estimator", icon: <FaFileInvoiceDollar /> },
  { to: "/reports", label: "Reports", icon: <FaFolderOpen /> },
];
export default function Sidebar() {
  return (
    <aside className="sidebar">
        <div className="logo">
               <div className="app-name">
          <img src="./logo.png" alt="TaxPal" />
           <h1>TaxPal</h1>
        </div>
      {/* </div> */}

       <nav className="nav" aria-label="Main navigation">
          <ul className="sidebar-list">
            {items.map((it) => (
              <li key={it.to} className="sidebar-list-item">
                <NavLink
                  to={it.to}
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                  <span className="icon" aria-hidden="true">{it.icon}</span>
                  <span className="label">{it.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
                </div>

     
      <div className="sidebar-bottom">
        <div className="profile">
          <img src="/logo.png" alt="Profile" className="avatar" />
          <div className="profile-info">
            <div className="profile-name">TaxPal</div>
            <div className="profile-sub">
              <NavLink to="/setting"  style = {{color: "white",textDecoration:"none" }}>Settings</NavLink>
            </div>
      
          </div>
        </div>
      </div>
    </aside>
  );
}