import express from "express";
import upload from "../middleware/upload.js";

import {
    createResult,
    getResults,
    updateResult,
    deleteResult
} from "../controllers/resultController.js";

const router = express.Router();

/* CREATE (WITH PDF) */
router.post("/createresult", upload.single("file"), createResult);

/* GET */
router.get("/getresults", getResults);

/* UPDATE */
router.put("/updateresult/:id", upload.single("file"), updateResult);

/* DELETE */
router.delete("/deleteresult/:id", deleteResult);

export default router;