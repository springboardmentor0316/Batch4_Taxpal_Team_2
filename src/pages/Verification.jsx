import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/Verification.css";

const Verification = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const navigate = useNavigate();

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 3) {
        document.getElementById(`code-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length === 4) {
      navigate("/reset-password");
    } else {
      alert("Please enter all 4 digits");
    }
  };

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <div className="verify-page">
      {/* LEFT SECTION */}
      <div className="verify-left">
        <img
          src="/assets/images/verification-image.png"
          alt="Verification Illustration"
          className="verify-illustration"
        />
      </div>

      {/* RIGHT SECTION */}
      <div className="verify-right">
        <div className="verify-card">
          {/* Back Icon positioned above title */}
          <div className="back-icon-container">
            <FaArrowLeft className="back-icon" onClick={handleBack} />
          </div>

          <h2 className="verify-title">Verify code</h2>
          <p className="verify-subtitle">
            An authentication code has been sent to your email.
          </p>

          <form onSubmit={handleSubmit} className="verify-form">
            <div className="code-inputs">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  className="code-box"
                />
              ))}
            </div>

            <p className="resend-text">
              Didn’t receive a code?{" "}
              <span className="resend-link">Resend</span>
            </p>

            <button type="submit" className="verify-btn">
              Verify
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Verification;
