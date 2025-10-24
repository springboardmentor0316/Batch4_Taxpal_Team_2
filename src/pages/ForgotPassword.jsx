import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import "../styles/ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset request for:", email);

    if (email) {
      navigate("/verification");
    }
  };

  const handleBack = () => {
    navigate("/login"); // go back to login page
  };

  return (
    <div className="forgot-page">
      {/* LEFT SECTION */}
      <div className="forgot-left">
        <img
          src="/assets/images/forgot-image.png"
          alt="Forgot Password Illustration"
          className="forgot-illustration"
        />
      </div>

      {/* RIGHT SECTION */}
      <div className="forgot-right">
        <div className="forgot-card">
          {/* 🔙 BACK ICON (above title) */}
          <div className="back-icon-container">
            <FaArrowLeft className="back-icon" onClick={handleBack} />
          </div>

          <h2 className="forgot-title">Forgot Password</h2>
          <p className="forgot-subtitle">
            Don’t worry, happens to all of us. Enter your email below to recover your password.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
