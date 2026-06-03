import express from "express";

import {
    createComplaint,
    getComplaint,
    updateComplaint,
    deleteComplaint
} from "../controllers/complainPrincipalController.js";

const router = express.Router();

router.post("/createcomplain", createComplaint);

router.get("/getallcomplain", getComplaint);

router.put("/updatecomplain/:id", updateComplaint);

router.delete("/deletecomplain/:id", deleteComplaint);

export default router;