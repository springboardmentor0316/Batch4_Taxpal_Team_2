import express from "express";
import {
  register,
  login,
  forgotPassword,
  verifyResetCode,
  resendResetCode,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// Authentication routes
router.post("/register", register);
router.post("/login", login);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/resend-reset-code", resendResetCode);
router.post("/reset-password", resetPassword);

export default router;
