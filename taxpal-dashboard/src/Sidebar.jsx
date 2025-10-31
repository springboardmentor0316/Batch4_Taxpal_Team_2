import React from "react";
import { FaTachometerAlt, FaExchangeAlt, FaRegChartBar, FaFileInvoiceDollar, FaFolderOpen } from "react-icons/fa";
import Logo from "./assets/TaxPal_logo.png";
import ProfileImg from "./assets/profile.jpeg";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo">
          <div className="app-name">
            <img src={Logo} alt="TaxPal" className="avatar" />
            <span>TaxPal</span>
          </div>
        </div>
      </div>

      <button className="nav-item active"><FaTachometerAlt /> <span>Dashboard</span></button>
      <button className="nav-item"><FaExchangeAlt /> <span>Transactions</span></button>
      <button className="nav-item"><FaRegChartBar /> <span>Budgets</span></button>
      <button className="nav-item"><FaFileInvoiceDollar /> <span>Tax Estimator</span></button>
      <button className="nav-item"><FaFolderOpen /> <span>Reports</span></button>

      <div className="sidebar-bottom">
        <div className="profile">
          <img src={ProfileImg} alt="Profile" className="avatar" />
          <div>
            <div className="profile-name">John Doe</div>
            <div className="profile-sub">Settings</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
