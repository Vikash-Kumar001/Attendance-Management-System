import express from "express";
import {
  createClass,
  getAllClasses,
  getClassById,
  deleteClass,
  assignStudentToClass,
} from "../controllers/classController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new class (Admin/Teacher only)
router.post("/", protect, createClass);

// Get all classes
router.get("/", protect, getAllClasses);

// Get a class by ID
router.get("/:id", protect, getClassById);

// Delete a class
router.delete("/:id", protect, deleteClass);

// ✅ Assign student to class
router.post("/assign", protect, assignStudentToClass);

export default router;
