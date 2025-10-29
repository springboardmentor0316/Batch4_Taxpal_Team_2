import React from "react";
import './App.css'
import Sidebar from "./Sidebar";
import Home from "./Home";

export default function App() {
  return (
    <div className="app-grid">
      <Sidebar />
      <main className="main-area">
        <Home />
      </main>
    </div>
  );
}
