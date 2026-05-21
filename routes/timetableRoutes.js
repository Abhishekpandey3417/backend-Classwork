import express from "express";
import multer from "multer";

import {
    createTimetable,
    getTimetable,
    updateTimetable,
    deleteTimetable
} from "../controllers/timetableController.js";

const router = express.Router();

const upload = multer();

/* ================= CREATE ================= */
router.post("/createtimetable", upload.none(), createTimetable);

/* ================= GET ================= */
router.get("/getalltimetable", getTimetable);

/* ================= UPDATE ================= */
router.put("/updatetimetable/:id", upload.none(), updateTimetable);

/* ================= DELETE ================= */
router.delete("/deletetimetable/:id", deleteTimetable);

export default router;