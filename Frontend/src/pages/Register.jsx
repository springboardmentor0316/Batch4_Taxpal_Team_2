import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Register.css";
import { toast } from "react-toastify";
import "../styles/InputField.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    incomeBracket: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Handle Register
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Left Image Section */}
      <div className="register-left">
        <img
          src="/assets/images/register-image.png"
          alt="Register Illustration"
          className="register-left-image"
        />
      </div>

      {/* Right Form Section */}
      <div className="register-right">
        <div className="register-card">
          <h1 className="register-title">Register</h1>
          <p className="register-subtitle">Create your TaxPal account</p>

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="form-group">
              <label>Username</label>
              <div className="input-with-icon">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email</label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Confirm Password */}
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span
                  className="toggle-icon"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* Country and Income */}
            <div className="form-row">
              <div className="form-group half">
                <label>Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="India">India</option>
                </select>
              </div>

              <div className="form-group half">
                <label>Income Bracket</label>
                <select
                  name="incomeBracket"
                  value={formData.incomeBracket}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="login-text">
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
