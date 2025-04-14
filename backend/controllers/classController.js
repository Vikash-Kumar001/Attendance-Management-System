import Class from "../models/Class.js";
import User from "../models/Users.js";

// Create a new class
const createClass = async (req, res) => {
  const { name, section } = req.body;

  try {
    const existing = await Class.findOne({ name, section });
    if (existing) {
      return res.status(400).json({ message: "Class already exists" });
    }

    const newClass = await Class.create({ name, section });
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all classes
const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get class by ID
const getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);
    if (classData) {
      res.json(classData);
    } else {
      res.status(404).json({ message: "Class not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete class
const deleteClass = async (req, res) => {
  try {
    const classToDelete = await Class.findById(req.params.id);
    if (classToDelete) {
      await classToDelete.remove();
      res.json({ message: "Class deleted" });
    } else {
      res.status(404).json({ message: "Class not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Assign a student to a class
const assignStudentToClass = async (req, res) => {
  const { studentId, classId } = req.body;

  try {
    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.class = classId;
    await student.save();

    res.json({ message: "Student assigned to class successfully", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createClass,
  getAllClasses,
  getClassById,
  deleteClass,
  assignStudentToClass,
};
