// controllers/authController.js
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("Email send error:", error);
  }
};

export const register = async (req, res) => {
  try {
    const { fullName, username, email, password, country, incomeBracket } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName: fullName || username || "User",
      username,
      email,
      password: hashed,
      country,
      incomeBracket,
      verified: true,
    });

    await newUser.save();
    res.json({ message: "Registration successful! Please login." });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Login successful", token, user: { id: user._id, email: user.email, fullName: user.fullName } });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    user.verificationCode = code;
    user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendMail(email, "TaxPal - Password Reset Code", `Your 4-digit password reset code is: ${code}\n\nThis code expires in 10 minutes.`);
    res.json({ message: "Verification code sent to your email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.verificationCode !== code) return res.status(400).json({ message: "Invalid code" });
    if (user.verificationCodeExpires < new Date()) return res.status(400).json({ message: "Code expired" });
    res.json({ message: "Code verified successfully" });
  } catch (err) {
    console.error("Verify Reset Code Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const resendResetCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    user.verificationCode = newCode;
    user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendMail(email, "TaxPal - New Password Reset Code", `Your new 4-digit password reset code is: ${newCode}\n\nThis code expires in 10 minutes.`);
    res.json({ message: "New verification code sent" });
  } catch (err) {
    console.error("Resend Reset Code Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.verificationCode !== code) return res.status(400).json({ message: "Invalid or expired code" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
