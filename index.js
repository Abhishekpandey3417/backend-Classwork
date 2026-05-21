import dotenv from "dotenv";
dotenv.config({ path: new URL('./.env', import.meta.url).pathname });

import express from "express";
import cors from "cors";
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

console.log("ENV CHECK:", process.env.DB_USER);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// ✅ ADD THIS (IMPORTANT)
app.use(express.urlencoded({ extended: true }));

// ✅ Already present (good)
app.use(express.json());

app.get("/", (req, res) => {
    res.send(`Your server is running on port ${PORT}`);
});

app.use("/uploads", express.static("uploads"));

app.use("/api/tasks", taskRoutes);
app.use("/api/homework", homeworkRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/classnotices", classnoticeRoutes);
app.use("/api/noticeboard", noticeboardRoutes);
app.use("/api/holiday", holidayRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/classactivity", classactivityRoutes);
app.use("/api/schoolnotice", schoolNoticeRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/syllabus", syllabusRoutes);
app.use("/api/online-classes", onlineClassRoutes);
app.use("/api/hpc-syllabus", hpcSyllabusRoutes);
app.use("/api/student-profile", studentProfileRoutes);
app.use("/api/drop-down", dropdownSectionRoutes);
app.use("/api/academic-doubt", academicDoubtRoutes);

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});