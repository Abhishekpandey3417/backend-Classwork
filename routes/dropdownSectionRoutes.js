import express from "express";

import {
    createDropdownSection,
    getDropdownSections,
    updateDropdownSection,
    deleteDropdownSection
} from "../controllers/dropdownsectionController.js";

const router = express.Router();


router.post("/createdropdownsection", createDropdownSection);

router.get("/getalldropdownsection", getDropdownSections);

router.put("/updatedropdownsection/:id", updateDropdownSection);

router.delete("/deletedropdownsection/:id", deleteDropdownSection);


export default router;