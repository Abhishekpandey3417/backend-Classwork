import express from "express";
import multer from "multer";
import {
    createNoticeBoard,
    getNoticeBoard,
    updateNoticeBoard,
    deleteNoticeBoard
} from "../controllers/noticeBoardController.js";

const router = express.Router();
const upload = multer();

router.post("/createNoticeBoard", upload.none(), createNoticeBoard);
router.get("/getAllNoticeBoard", getNoticeBoard);
router.put("/updateNoticeBoard/:id", upload.none(), updateNoticeBoard);
router.delete("/deleteNoticeBoard/:id", deleteNoticeBoard);

export default router;