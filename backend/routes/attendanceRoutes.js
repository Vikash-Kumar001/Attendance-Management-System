import express from "express";
import {
  markAttendance,
  getMyAttendance,
  getClassAttendance,
  getAllAttendance,
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Mark attendance (Teacher/Admin only)
router.post("/mark", protect, markAttendance);

// Student: View own attendance
router.get("/my", protect, getMyAttendance);

// Teacher/Admin: View attendance by class
router.get("/class/:classId", protect, getClassAttendance);

// Admin: View all attendance records
router.get("/all", protect, getAllAttendance);

export default router;
