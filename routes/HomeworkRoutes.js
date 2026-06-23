import express from "express";
import {
    createHomework,
    getHomework,
    updateHomework,
    deleteHomework,
    uploadHomework,
    getUploadsHomeworks,
    updateUploadHomework,
    deleteUploadHomework
} from "../controllers/homeworkController.js";

import upload from "../middleware/upload.js";
import schoolMiddleware from "../middleware/schoolMiddleware.js";

const router = express.Router();

/* ================= HOMEWORK ================= */

router.get("/getAllHomeworks", getHomework);
router.post("/createHomework", createHomework);
router.put("/updateHomework/:id", updateHomework);
router.delete("/deleteHomework/:id", deleteHomework);

/* ================= HOMEWORK UPLOAD ================= */

router.post(
    "/uploadHomework",
    schoolMiddleware,
    upload.single("file"),
    uploadHomework
);

router.put(
    "/uploadHomework/:id",
    schoolMiddleware,
    upload.single("file"),
    updateUploadHomework
);

router.get(
    "/getAlUploadedHomeworks",
    schoolMiddleware,
    getUploadsHomeworks
);

router.delete(
    "/deleteuploadedHomework/:id",
    schoolMiddleware,
    deleteUploadHomework
);

export default router;