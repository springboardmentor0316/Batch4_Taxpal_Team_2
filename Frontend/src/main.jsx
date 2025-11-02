// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 👈 1. Import BrowserRouter
import App from './App';
import './styles/App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 👈 2. Wrap your entire application with the Router */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);