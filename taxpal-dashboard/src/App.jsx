import React from "react";
import { Routes, Route } from "react-router-dom";
import './App.css'
import Sidebar from "./sidebar";
import Home from "./home";
import Setting from"./setting";

export default function App() {
  return (
    <div className="app-grid">
      <Sidebar />
      <main className="main-area">
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/setting" element={<Setting />} />
            {/* <Route path="*" element={<div style={{padding:20}}>Page not found</div>} /> */}
        </Routes>
      </main>
    </div>
  );
}
