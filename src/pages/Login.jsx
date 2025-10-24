import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login data:", { email, password });
    // navigate("/dashboard");
  };

  return (
    <div className="login-page">
  {/* LEFT SECTION */}
  <div className="login-left">
    <img
      src="/assets/images/login-image.png"
      alt="Login Illustration"
      className="login-illustration"
    />
  </div>

      {/* RIGHT SECTION */}
      <div className="login-right">
        <div className="login-card">
          <h2 className="login-title">Login</h2>
          <p className="login-subtitle">Login to your TaxPal account</p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
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

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="forgot-password">
              <Link to="/forgot-password" className="link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>

            <p className="register-text">
              Don’t have an account?{" "}
              <Link to="/register" className="link">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
