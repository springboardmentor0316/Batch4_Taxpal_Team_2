import React from "react";
import { Routes, Route } from "react-router-dom";
import './App.css'
import Sidebar from "./Sidebar";
import Home from "./Home";
import Setting from"./settings";
import Budget from "./Budget";

export default function App() {
  return (
    <div className="app-grid">
      <Sidebar />
      <main className="main-area">
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/Budget" element={<Budget />} />
            {/* <Route path="*" element={<div style={{padding:20}}>Page not found</div>} /> */}
        </Routes>
      </main>
    </div>
  );
}