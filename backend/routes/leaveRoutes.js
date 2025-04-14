import express from "express";
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  deleteLeaveByStudent,
} from "../controllers/leaveController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", protect, applyLeave);

router.get("/my", protect, getMyLeaves);

router.delete("/:id", protect, deleteLeaveByStudent);

router.get("/all", protect, getAllLeaves);

router.put("/update/:leaveId", protect, updateLeaveStatus);

export default router;
