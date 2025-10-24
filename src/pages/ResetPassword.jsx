import React, { useState } from "react";
import "../styles/ResetPassword.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset password submitted");
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
          <h2 className="reset-title">Reset password</h2>

          <form onSubmit={handleSubmit}>
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

            <button type="submit" className="reset-btn">
              Set password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
