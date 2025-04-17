// import express from "express";
// import {
//   registerUser,
//   authUser,
//   getUserProfile,
//   sendVerificationCode,
//   resetPassword,
// } from "../controllers/userControllers.js";
// import { protect, adminOnly } from "../middleware/authMiddleware.js";

// const router = express.Router();

// // Admin-only registration route
// router.post("/register", protect, adminOnly, registerUser);

// // Login route (public)
// router.post("/login", authUser);

// // Protected route to fetch logged-in user profile
// router.get("/profile", protect, getUserProfile);

// // Public routes for password reset flow
// router.post("/send-code", sendVerificationCode);
// router.post("/reset-password", resetPassword);

// export default router;



import express from "express";
import {
  registerUser,
  authUser,
  getUserProfile,
  sendVerificationCode,
  resetPassword,
  getAllUsers,
  deleteUser,
  updateUser
} from "../controllers/userControllers.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Public routes
router.post("/login", authUser);
router.post("/send-code", sendVerificationCode);
router.post("/reset-password", resetPassword);

// ✅ Protected user route
router.get("/profile", protect, getUserProfile);

// ✅ Admin-only routes
router.post("/", protect, adminOnly, registerUser);         // POST /api/users/
router.get("/", protect, adminOnly, getAllUsers);           // GET /api/users/
router.put("/:id", protect, adminOnly, updateUser);         // PUT /api/users/:id
router.delete("/:id", protect, adminOnly, deleteUser);      // DELETE /api/users/:id

export default router;
