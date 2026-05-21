import express from "express";
import multer from "multer";
import {
    createSchoolNotice,
    getSchoolNotices,
    updateSchoolNotice,
    deleteSchoolNotice
} from "../controllers/schoolController.js";

const router = express.Router();

// ✅ IMPORTANT
const upload = multer({ storage: multer.memoryStorage() });

router.post("/createschoolnotice", upload.none(), createSchoolNotice);
router.get("/getschoolnotices", getSchoolNotices);
router.put("/updateschoolnotice/:id", upload.none(), updateSchoolNotice);
router.delete("/deleteschoolnotice/:id", deleteSchoolNotice);

export default router;