import express from "express";
import {
    createAssignment,
    getAssignments,
    searchAssignments,
    updateAssignment,
    deleteAssignment
} from "../controllers/assignmentController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/create", upload.single("file"), createAssignment);          // Upload
router.get("/getAll", getAssignments);                   // List
router.get("/search", searchAssignments);          // Search
router.put("/:id", updateAssignment);
router.delete("/:id", deleteAssignment);

export default router;