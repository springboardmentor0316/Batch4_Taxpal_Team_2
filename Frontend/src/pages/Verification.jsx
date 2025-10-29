import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/Verification.css";
import { toast } from "react-toastify";
const Verification = () => {
  const [code, setCode] = useState(["", "", "", ""]); // 4-digit code
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // ✅ Handle input for 4-digit OTP
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

  // ✅ Verify Code
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length !== 4) {
      toast.error("Please enter all 4 digits");
      return;
    }

    if (!email) {
      toast.error("Missing email. Please go back to Forgot Password.");
      navigate("/forgot-password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: fullCode }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        toast.error(data.message || "Verification failed.");
        return;
      }

      toast.success("Code verified successfully!");
      navigate("/reset-password", { state: { email, code: fullCode } });

    } catch (err) {
      console.error("Verification error:", err);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // ✅ Resend Code
  const handleResend = async () => {
    if (!email) {
      toast.error("Missing email. Please go back to Forgot Password.");
      return;
    }

    setResending(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/resend-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setResending(false);

      if (!res.ok) {
        toast.error(data.message || "Failed to resend code.");
        return;
      }

      toast.success("A new verification code has been sent to your email!");
    } catch (err) {
      console.error("Resend error:", err);
      toast.error("Something went wrong. Please try again.");
      setResending(false);
    }
  };

  const handleBack = () => {
    navigate("/forgot-password");
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
          <div className="back-icon-container">
            <FaArrowLeft className="back-icon" onClick={handleBack} />
          </div>

          <h2 className="verify-title">Verify Code</h2>
          <p className="verify-subtitle">
            A 4-digit code has been sent to your email:
            <br />
            <strong>{email || "No email found"}</strong>
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
              <span
                className="resend-link"
                onClick={handleResend}
                disabled={resending}
              >
                {resending ? "Resending..." : "Resend"}
              </span>
            </p>

            <button type="submit" className="verify-btn" disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Verification;
