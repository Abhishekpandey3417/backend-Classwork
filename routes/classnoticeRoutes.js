import express from "express";
import multer from "multer";
import {
    createNotice,
    getNotices,
    updateNotice,
    deleteNotice
} from "../controllers/classnoticeController.js";

const router = express.Router();

// ✅ Add this
const upload = multer();

// ✅ Use upload.none() for form-data
router.post("/createClassNotice", upload.none(), createNotice);

router.get("/getClassNotice", getNotices);
router.put("/updateClassNotice/:id", upload.none(), updateNotice);
router.delete("/deleteClassNotice/:id", deleteNotice);

export default router;