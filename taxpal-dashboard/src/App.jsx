import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Sidebar from "./Sidebar";
import Home from "./Home";
import Budget from "./pages/Budget";
import CreateBudget from "./pages/CreateBudget";
import EditBudget from "./pages/EditBudget";

export default function App() {
  return (
    <Router>
      <div className="app-grid">
        <Sidebar />
        <main className="main-area">
          <Routes>
            {/* Home page */}
            <Route path="/" element={<Home />} />

            {/* Budget pages */}
            <Route path="/budget" element={<Budget />} />
            <Route path="/budget/create" element={<CreateBudget />} />
            <Route path="/budget/edit/:id" element={<EditBudget />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
