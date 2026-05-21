import express from "express";

import upload from "../middleware/upload.js";

import {
    createHPCSyllabus,
    getHPCSyllabus,
    updateHPCSyllabus,
    deleteHPCSyllabus
} from "../controllers/hpcSyllabusController.js";

const router = express.Router();


router.post(
    "/createhpcsyllabus",
    upload.single("file"),
    createHPCSyllabus
);

router.get(
    "/getallhpcsyllabus",
    getHPCSyllabus
);

router.put(
    "/updatehpcsyllabus/:id",
    upload.single("file"),
    updateHPCSyllabus
);

router.delete(
    "/deletehpcsyllabus/:id",
    deleteHPCSyllabus
);


export default router;