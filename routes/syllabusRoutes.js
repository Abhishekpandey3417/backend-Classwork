import express from "express";
import upload from "../middleware/upload.js";
import {
    createSyllabus,
    getSyllabus,
    searchSyllabus,
    updateSyllabus,
    deleteSyllabus
} from "../controllers/syllabusController.js";

const router = express.Router();

router.post("/createsyllabus", upload.single("file"), createSyllabus);
router.get("/getallsyllabus", getSyllabus);
router.get("/searchsyllabus", searchSyllabus);
router.put("/updatesyllabus/:id", upload.single("file"), updateSyllabus);
router.delete("/deletesyllabus/:id", deleteSyllabus);

export default router;