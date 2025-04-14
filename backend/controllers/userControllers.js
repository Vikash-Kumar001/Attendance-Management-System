import User from "../models/Users.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

// Admin-only register
const registerUser = async (req, res) => {
  const { name, email, password, uniqueId, role, class: userClass } = req.body;

  try {
    if (!["student", "teacher", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const emailExists = await User.findOne({ email });
    const idExists = await User.findOne({ uniqueId });

    if (emailExists || idExists) {
      return res.status(400).json({ message: "Email or ID already exists" });
    }

    // Optional validation on ID format
    if (role === "student" && !uniqueId.startsWith("STU")) {
      return res.status(400).json({ message: "Student ID must start with STU" });
    }
    if (role === "teacher" && !uniqueId.startsWith("FAC")) {
      return res.status(400).json({ message: "Faculty ID must start with FAC" });
    }
    if (role === "admin" && !uniqueId.startsWith("ADM")) {
      return res.status(400).json({ message: "Admin ID must start with ADM" });
    }

    const user = await User.create({
      name,
      email,
      password,
      uniqueId,
      role,
      class: userClass || null,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      uniqueId: user.uniqueId,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login using uniqueId
const authUser = async (req, res) => {
  const { uniqueId, password } = req.body;

  try {
    const user = await User.findOne({ uniqueId }).populate("class");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid ID or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      uniqueId: user.uniqueId,
      role: user.role,
      class: user.class,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("class");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      uniqueId: user.uniqueId,
      role: user.role,
      class: user.class,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send verification code
const sendVerificationCode = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = code;
    user.resetCodeExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail({
      to: email,
      subject: "Password Reset Verification Code",
      text: `Your verification code is: ${code}`,
    });

    res.json({ message: "Verification code sent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset password using code
const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (
      !user ||
      user.resetCode !== code ||
      user.resetCodeExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    user.password = newPassword;
    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  registerUser,
  authUser,
  getUserProfile,
  sendVerificationCode,
  resetPassword,
};
