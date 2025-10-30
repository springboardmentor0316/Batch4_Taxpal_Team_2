import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  country: String,
  incomeBracket: String,
  verified: { type: Boolean, default: false },
  verificationCode: String,
  verificationCodeExpires: Date,
});

export default mongoose.model("User", userSchema);
