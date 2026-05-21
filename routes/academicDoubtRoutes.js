import express from "express";

import {
    createAcademicDoubt,
    getAcademicDoubt,
    updateAcademicDoubt,
    deleteAcademicDoubt
} from "../controllers/AcademicDoubtController.js";

const router = express.Router();


/* ================= CRUD ROUTES ================= */

router.post("/createacademicdoubt", createAcademicDoubt);

router.get("/getallacademicdoubt", getAcademicDoubt);

router.put("/updateacademicdoubt/:id", updateAcademicDoubt);

router.delete("/deleteacademicdoubt/:id", deleteAcademicDoubt);


export default router;