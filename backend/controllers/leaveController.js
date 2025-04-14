import LeaveApplication from "../models/LeaveApplication.js";
import User from "../models/Users.js";

// Student applies for leave
const applyLeave = async (req, res) => {
  const { reason, fromDate, toDate } = req.body;

  try {
    const leave = await LeaveApplication.create({
      student: req.user._id,
      reason,
      fromDate,
      toDate,
    });

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get leaves submitted by the logged-in student
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await LeaveApplication.find({ student: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin/Teacher: Get all leave applications
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await LeaveApplication.find()
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin/Teacher: Approve or reject leave
const updateLeaveStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const leave = await LeaveApplication.findById(id);

    if (!leave) {
      return res.status(404).json({ message: "Leave application not found" });
    }

    leave.status = status;
    leave.reviewedBy = req.user._id;

    const updated = await leave.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student: Cancel own pending leave
const deleteLeaveByStudent = async (req, res) => {
  try {
    const leave = await LeaveApplication.findById(req.params.id);

    if (!leave || leave.student.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Leave not found or not authorized" });
    }

    if (leave.status !== "Pending") {
      return res.status(400).json({ message: "Only pending leaves can be cancelled" });
    }

    await leave.deleteOne();
    res.json({ message: "Leave cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  deleteLeaveByStudent,
};
