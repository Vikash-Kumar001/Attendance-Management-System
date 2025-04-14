import Attendance from "../models/Attendance.js";
import User from "../models/Users.js";

// Mark attendance (by teacher/admin)
const markAttendance = async (req, res) => {
  const { studentId, date, status } = req.body;

  try {
    const existing = await Attendance.findOne({ student: studentId, date });

    if (existing) {
      return res.status(400).json({ message: "Attendance already marked" });
    }

    const attendance = await Attendance.create({
      student: studentId,
      date,
      status,
      markedBy: req.user._id,
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance for logged-in student
const getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.user._id }).sort({
      date: -1,
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all attendance for a specific class
const getClassAttendance = async (req, res) => {
  const { classId } = req.params;

  try {
    const students = await User.find({ class: classId });
    const attendanceData = await Attendance.find({
      student: { $in: students.map((u) => u._id) },
    })
      .populate("student", "name email")
      .sort({ date: -1 });

    res.json(attendanceData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all attendance records (admin) with filtering
const getAllAttendance = async (req, res) => {
  const { classId, studentId, startDate, endDate } = req.query;

  let filters = {};

  try {
    if (studentId) {
      filters.student = studentId;
    }

    if (classId) {
      const students = await User.find({ class: classId });
      filters.student = { $in: students.map((u) => u._id) };
    }

    if (startDate && endDate) {
      filters.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const records = await Attendance.find(filters)
      .populate("student", "name email")
      .populate("markedBy", "name email")
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  markAttendance,
  getMyAttendance,
  getClassAttendance,
  getAllAttendance,
};
