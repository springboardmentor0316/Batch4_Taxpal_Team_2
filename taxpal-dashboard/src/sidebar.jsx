import React from "react";
import { FaTachometerAlt, FaExchangeAlt, FaRegChartBar, FaFileInvoiceDollar, FaFolderOpen } from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo">
               <div className="app-name">
          <img src="public/logo.png" alt="TaxPal" />
     
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
          <div >
          <img src="public/logo.png" alt="TaxPal" className="avatar"/>
          </div>
          <div>
            <div className="profile-name">TaxPal</div>
            <div className="profile-sub">Settings</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
