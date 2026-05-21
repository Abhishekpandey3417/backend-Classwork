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

const router = express.Router();

// Homework list
router.post("/createHomework", createHomework);
router.get("/getAllHomeworks", getHomework);
router.put("/updateHomework/:id", updateHomework);
router.delete("/deleteHomework/:id", deleteHomework);
router.post("/uploadHomework", upload.single("file"), uploadHomework);

router.put("/uploadHomework/:id", upload.single("file"), updateUploadHomework);
router.get("/getAlUploadedHomeworks", getUploadsHomeworks);
router.delete("/deleteuploadedHomework/:id", deleteUploadHomework);

export default router;