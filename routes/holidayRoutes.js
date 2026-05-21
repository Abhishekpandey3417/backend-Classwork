import express from "express";
import multer from "multer";
import {

    createHoliday,
    getHolidays,
    updateHoliday,
    deleteHoliday
} from "../controllers/holidayController.js";

const router = express.Router();

const upload = multer();

// Activity


// Holiday
router.post("/createholiday", upload.none(), createHoliday);
router.get("/getholiday", getHolidays);

router.put("/updateholiday/:id", upload.none(), updateHoliday);
router.delete("/deleteholiday/:id", deleteHoliday);

export default router;




