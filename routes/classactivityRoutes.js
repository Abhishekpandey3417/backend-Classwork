import express from "express";
import multer from "multer";
import {
    createActivity,
    getActivities,
    updateActivity,
    deleteActivity

} from "../controllers/classactivityController.js";

const router = express.Router();

const upload = multer();

// Activity
router.post("/createactivity", upload.none(), createActivity);
router.get("/getactivity", getActivities);

router.put("/updateactivity/:id", upload.none(), updateActivity);
router.delete("/deleteactivity/:id", deleteActivity);

export default router;