import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import setupRoutes from "./routes/setupRoutes.js"; // ✅ Added

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/setup", setupRoutes); // ✅ Added

app.get("/", (req, res) => {
  res.send("College Attendance Management System API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on ${PORT}`);
});
