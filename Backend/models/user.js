// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    username: { type: String }, // optional alias
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    country: { type: String, default: "India" },
    currency: { type: String, default: "₹" },
    profilePicture: { type: String },
    incomeBracket: { type: String },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String, default: null },
    verificationCodeExpires: { type: Date, default: null }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
