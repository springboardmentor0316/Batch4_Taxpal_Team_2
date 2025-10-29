import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/ResetPassword.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Receive email & code from Verification.jsx
  const email = location.state?.email;
  const code = location.state?.code;

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    if (!email || !code) {
      alert("Missing verification details. Please verify again.");
      navigate("/forgot-password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword: password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data.message || "Password reset failed.");
        return;
      }

      toast.success("✅ Password updated successfully!");

      navigate("/login");
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error("❌ Something went wrong!");

      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      {/* LEFT SIDE */}
      <div className="reset-left">
        <img
          src="/assets/images/reset-image.png"
          alt="Reset illustration"
          className="reset-image"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="reset-right">
        <div className="reset-card">
          <h2 className="reset-title">Reset Password</h2>
          <p className="reset-subtitle">
            Enter a new password for your account.
          </p>

          <form onSubmit={handleSubmit}>
            {/* New Password */}
            <div className="form-group">
              <label>New Password</label>
              <div className="input-box">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span onClick={() => setShowPass(!showPass)}>
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-box">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
                <span onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="reset-btn" disabled={loading}>
              {loading ? "Updating..." : "Set Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
