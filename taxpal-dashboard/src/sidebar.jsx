import React from "react";
import { FaTachometerAlt, FaExchangeAlt, FaRegChartBar, FaFileInvoiceDollar, FaFolderOpen } from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside className="sidebar">
        <div className="logo">
               <div className="app-name">
          <img src="./logo.png" alt="TaxPal" />
           <h1>TaxPal</h1>
        </div>
      {/* </div> */}

        <ul className ="sidebar-list">
                    <li className ="sidebar-list-item active ">
                        <a href = "">
                           <FaTachometerAlt /> Dashboard
                        </a>
                    </li>
                    <li className ="sidebar-list-item">
                        <a href = "">
                           <FaExchangeAlt /> Transactions
                        </a>
                    </li>
                    <li className ="sidebar-list-item">
                        <a href = "">
                           <FaRegChartBar /> Budgets
                        </a>
                    </li>
                    <li className ="sidebar-list-item">
                        <a href = "">
                           <FaFileInvoiceDollar /> Tax Estimator
                        </a>
                    </li>
                    <li className ="sidebar-list-item">
                        <a href = "">
                           <FaFolderOpen />Reports
                        </a>
                    </li>
                </ul>
                </div>

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
