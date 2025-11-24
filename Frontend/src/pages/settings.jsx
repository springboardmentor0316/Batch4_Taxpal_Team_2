import React, { useState, useEffect, useCallback } from "react";
import { FiEdit2, FiX, FiPlus, FiUser, FiCamera, FiLock, FiLogOut } from "react-icons/fi";
import "../styles/Settings.css";

export default function Settings() {
  const [panel, setPanel] = useState("profile");
  const [tab, setTab] = useState("expense");
  const [categories, setCategories] = useState([]);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    country: "",
    currency: "",
    profilePicture: null
  });

  const [notifications, setNotifications] = useState({
    budgetExceed: true,
    quarterlyTax: true,
    monthlySummary: false
  });

  const token = localStorage.getItem("token");

  // Load Profile From Backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        if (json.success) {
          setProfile(prev => ({
            ...prev,
            fullName: json.data.fullName,
            email: json.data.email,
            country: json.data.country,
            currency: json.data.currency,
            profilePicture: json.data.profilePicture || null
          }));
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };
    fetchProfile();
  }, [token]);

  // Fetch categories from backend
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setCategories(json.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Add category
  const addCategory = async () => {
    const name = prompt("Enter category name:");
    if (!name) return;
    const color = "#" + Math.floor(Math.random() * 16777215).toString(16);

    try {
      await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, type: tab, color }),
      });
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const editCategory = async (id) => {
    const name = prompt("Edit category name:");
    if (!name) return;

    try {
      await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name }),
      });
      fetchCategories();
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const filtered = categories.filter((c) => c.type === tab);

  // Save profile to backend (EMAIL NOT UPDATED)
  const saveProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: profile.fullName,
          country: profile.country,
          currency: profile.currency,
          profilePicture: profile.profilePicture
        })
      });

      const json = await res.json();

      if (json.success) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating profile");
    }
  };

  // Upload profile picture
  const handleProfilePicture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const changePassword = () => {
    alert("Change Password feature coming soon.");
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p className="header-subtitle">Manage your account settings and preferences</p>
      </div>

      <div className="settings-layout">
        
        {/* Sidebar */}
        <div className="settings-sidebar">
          <div className="sidebar-menu">
            {["profile","categories","notifications","security"].map(item => (
              <div key={item}
                className={`menu-item ${panel === item ? "active" : ""}`}
                onClick={() => setPanel(item)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="settings-content">

          {/* Profile Panel */}
          {panel === "profile" && (
            <div>
              <h2>Profile Settings</h2>

              <div className="profile-section">
                <div className="profile-picture-container">
                  <div className="profile-picture">
                    {profile.profilePicture ? (
                      <img src={profile.profilePicture} alt="Profile" />
                    ) : (
                      <FiUser size={40} />
                    )}
                  </div>
                  <label className="camera-icon">
                    <FiCamera size={16} />
                    <input type="file" accept="image/*" onChange={handleProfilePicture} />
                  </label>
                </div>
                <div className="profile-info">
                  <h3>{profile.fullName}</h3>
                  <p className="email-text">{profile.email}</p>
                </div>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={profile.email} readOnly className="form-input readonly" />
                  <p className="help-text">Email cannot be changed</p>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Country</label>
                    <select
                      value={profile.country}
                      onChange={(e) => setProfile(prev => ({ ...prev, country: e.target.value }))}
                      className="form-input"
                    >
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Currency</label>
                    <select
                      value={profile.currency}
                      onChange={(e) => setProfile(prev => ({ ...prev, currency: e.target.value }))}
                      className="form-input"
                    >
                      <option value="₹">₹ INR</option>
                      <option value="$">$ USD</option>
                      <option value="€">€ EUR</option>
                      <option value="£">£ GBP</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                <button onClick={saveProfile} className="btn-primary">Save Changes</button>
                <button onClick={changePassword} className="btn-secondary">Change Password</button>
              </div>
            </div>
          )}

          {/* Categories Panel */}
          {panel === "categories" && (
            <div>
              <h2>Category Management</h2>

              <div className="tabs">
                <button className={`tab ${tab === "expense" ? "active" : ""}`} onClick={() => setTab("expense")}>Expense Categories</button>
                <button className={`tab ${tab === "income" ? "active" : ""}`} onClick={() => setTab("income")}>Income Categories</button>
              </div>

              <div className="category-list">
                {filtered.map(cat => (
                  <div key={cat._id} className="category-item">
                    <div className="category-info">
                      <span className="category-dot" style={{ background: cat.color }} />
                      <span className="category-name">{cat.name}</span>
                    </div>
                    <div className="category-actions">
                      <button onClick={() => editCategory(cat._id)} className="icon-btn"><FiEdit2 size={18} /></button>
                      <button onClick={() => deleteCategory(cat._id)} className="icon-btn"><FiX size={18} /></button>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && <div className="empty-state">No categories yet</div>}
              </div>

              <button onClick={addCategory} className="btn-add"><FiPlus size={20} /> Add New Category</button>
            </div>
          )}

          {/* Notifications */}
          {panel === "notifications" && (
            <div>
              <h2>Notification Preferences</h2>
              <div className="notification-list">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="notification-item">
                    <div className="notification-info">
                      <h3>{key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}</h3>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={value} onChange={() => toggleNotification(key)} />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security */}
          {panel === "security" && (
            <div>
              <h2>Security Settings</h2>
              <div className="security-list">
                <div className="security-card">
                  <div className="security-icon"><FiLock size={24} /></div>
                  <div className="security-info">
                    <h3>Password</h3>
                    <button onClick={changePassword} className="btn-primary">Change Password</button>
                  </div>
                </div>
                <div className="security-card danger">
                  <div className="security-icon red"><FiLogOut size={24} /></div>
                  <button onClick={() => alert("Logging out from all devices...")} className="btn-danger">Logout from All Devices</button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
