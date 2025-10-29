import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import "../styles/ForgotPassword.css";
import { toast } from "react-toastify";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data.message || "Error sending verification code.");
        return;
      }

      alert("✅ Verification code sent to your email!");
      // Pass email to verification page
      navigate("/verification", { state: { email } });
    } catch (err) {
      console.error("Forgot password error:", err);
      setLoading(false);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <div className="forgot-page">
      <div className="forgot-left">
        <img
          src="/assets/images/forgot-image.png"
          alt="Forgot Password Illustration"
          className="forgot-illustration"
        />
      </div>

      <div className="forgot-right">
        <div className="forgot-card">
          <div className="back-icon-container">
            <FaArrowLeft className="back-icon" onClick={handleBack} />
          </div>

          <h2 className="forgot-title">Forgot Password</h2>
          <p className="forgot-subtitle">
            Don’t worry — it happens! Enter your email to reset your password.
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

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Code"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
