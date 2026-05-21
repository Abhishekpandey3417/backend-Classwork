import express from "express";

import {
    createOnlineClass,
    getOnlineClasses,
    updateOnlineClass,
    deleteOnlineClass
} from "../controllers/onlineclassController.js";

const router = express.Router();


router.post("/createonlineclass", createOnlineClass);

router.get("/getonlineclass", getOnlineClasses);

router.put("/updateonlineclass/:id", updateOnlineClass);

router.delete("/deleteonlineclass/:id", deleteOnlineClass);


export default router;