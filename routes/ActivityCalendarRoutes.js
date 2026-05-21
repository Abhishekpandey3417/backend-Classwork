import express from "express";
import multer from "multer";

import {
    createActivity,
    getActivities,
    updateActivity,
    deleteActivity
} from "../controllers/ActivityCalendarController.js";

const router = express.Router();
const upload = multer();

/* ================= CREATE ================= */
router.post("/createactivity", upload.none(), createActivity);

/* ================= GET ================= */
router.get("/getallactivity", getActivities);

/* ================= UPDATE ================= */
router.put("/updateactivity/:id", upload.none(), updateActivity);

/* ================= DELETE ================= */
router.delete("/deleteactivity/:id", deleteActivity);

export default router;