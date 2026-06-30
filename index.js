import dotenv from "dotenv";
dotenv.config({ path: new URL("./.env", import.meta.url).pathname });

import express from "express";
import cors from "cors";

/* ================= MIDDLEWARE ================= */

import { schoolMiddleware } from "./middleware/schoolMiddleware.js";

/* ================= AUTH ROUTES ================= */

import authRoutes from "./routes/authRoutes.js";

/* ================= FEATURE ROUTES ================= */


import signupRoutes from "./routes/signupRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import homeworkRoutes from "./routes/HomeworkRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import classnoticeRoutes from "./routes/classnoticeRoutes.js";
import noticeboardRoutes from "./routes/noticeBoardRoutes.js";
import schoolNoticeRoutes from "./routes/schoolRoutes.js";
import activityRoutes from "./routes/ActivityCalendarRoutes.js";
import holidayRoutes from "./routes/holidayRoutes.js";
import classactivityRoutes from "./routes/classactivityRoutes.js";
import timetableRoutes from "./routes/timetableRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import syllabusRoutes from "./routes/syllabusRoutes.js";
import onlineClassRoutes from "./routes/onlineClassRoutes.js";
import hpcSyllabusRoutes from "./routes/hpcSyllabusRoutes.js";
import studentProfileRoutes from "./routes/studentProfileRoutes.js";
import dropdownSectionRoutes from "./routes/dropdownSectionRoutes.js";
import academicDoubtRoutes from "./routes/academicDoubtRoutes.js";
import complainPrincipalRoutes from "./routes/complainPrincipalRoutes.js";

const app = express();
const PORT = process.env.PORT || 6000;

/* ================= CORS ================= */

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "school-code",
            "ngrok-skip-browser-warning"
        ]
    })
);

/* ================= BODY PARSER ================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= STATIC FILES ================= */

app.use("/uploads", express.static("uploads"));

/* ================= ROOT ================= */

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: `Server running on port ${PORT}`
    });
});

/* ==================================================
   AUTH ROUTES
   LOGIN DOES NOT REQUIRE schoolMiddleware
================================================== */

app.use("/api/auth", authRoutes);

/* ==================================================
   SCHOOL SPECIFIC ROUTES
   AFTER LOGIN ONLY
================================================== */

app.use("/api/tasks", schoolMiddleware, taskRoutes);
app.use("/api/homework", schoolMiddleware, homeworkRoutes);
app.use("/api/assignments", schoolMiddleware, assignmentRoutes);
app.use("/api/classnotices", schoolMiddleware, classnoticeRoutes);
app.use("/api/noticeboard", schoolMiddleware, noticeboardRoutes);
app.use("/api/holiday", schoolMiddleware, holidayRoutes);
app.use("/api/activity", schoolMiddleware, activityRoutes);
app.use("/api/classactivity", schoolMiddleware, classactivityRoutes);
app.use("/api/schoolnotice", schoolMiddleware, schoolNoticeRoutes);
app.use("/api/timetable", schoolMiddleware, timetableRoutes);
app.use("/api/results", schoolMiddleware, resultRoutes);
app.use("/api/syllabus", schoolMiddleware, syllabusRoutes);
app.use("/api/online-classes", schoolMiddleware, onlineClassRoutes);
app.use("/api/hpc-syllabus", schoolMiddleware, hpcSyllabusRoutes);
app.use("/api/student-profile", schoolMiddleware, studentProfileRoutes);
app.use("/api/drop-down", schoolMiddleware, dropdownSectionRoutes);
app.use("/api/academic-doubt", schoolMiddleware, academicDoubtRoutes);
app.use("/api/complain-principal", schoolMiddleware, complainPrincipalRoutes);
app.use("/api/signup", schoolMiddleware, signupRoutes);

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
    console.error("ERROR:", err);

    res.status(500).json({
        success: false,
        message: err.message,
        field: err.field || null
    });
});

/* ================= SERVER ================= */

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});