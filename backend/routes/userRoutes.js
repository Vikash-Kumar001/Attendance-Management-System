import express from "express";
import {
  registerUser,
  authUser,
  getUserProfile,
  sendVerificationCode,
  resetPassword,
} from "../controllers/userControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin-only registration route
router.post("/register", protect, adminOnly, registerUser);

// Login route (public)
router.post("/login", authUser);

// Protected route to fetch logged-in user profile
router.get("/profile", protect, getUserProfile);

// Public routes for password reset flow
router.post("/send-code", sendVerificationCode);
router.post("/reset-password", resetPassword);

export default router;
