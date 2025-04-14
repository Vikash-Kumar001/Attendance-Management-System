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

// router.post("/register", protect, adminOnly, registerUser);
router.post("/register", registerUser);
router.post("/login", authUser);
router.get("/profile", protect, getUserProfile);
router.post("/send-code", sendVerificationCode);
router.post("/reset-password", resetPassword);

export default router;
