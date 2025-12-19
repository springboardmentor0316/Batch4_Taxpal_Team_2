import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import User from "../models/user.js";

const router = express.Router();

// Get logged-in user profile
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch profile" });
  }
});

// Update profile (email cannot be updated)
router.put("/me", authenticateToken, async (req, res) => {
  try {
    const { fullName, country, currency, profilePicture } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, country, currency, profilePicture },
      { new: true }
    ).select("-password");

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update profile" });
  }
});

export default router;
