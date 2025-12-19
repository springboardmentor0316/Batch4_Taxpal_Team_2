import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import { toast } from "react-toastify";
const Home = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="home-container" 
      style={{ backgroundImage: "url(/assets/images/home-image.png)" }}
    >
      <div className="gradient-overlay">
        <div className="home-content">
          <h1 className="home-logo">
            Tax<span>Pal</span>
          </h1>

          <p className="home-description">
            Your smart companion to manage income, track expenses, and<br />
            estimate taxes all in one place
          </p>

          <button 
            className="home-button"
            onClick={() => navigate('/register')}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
