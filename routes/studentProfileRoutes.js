import express from "express";

import upload from "../middleware/upload.js";

import {
    createStudentProfile,
    getStudentProfiles,
    updateStudentProfile,
    deleteStudentProfile
} from "../controllers/studentProfileController.js";

const router = express.Router();


router.post(
    "/createstudentprofile",
    upload.single("file"),
    createStudentProfile
);

router.get(
    "/getallstudentprofile",
    getStudentProfiles
);

router.put(
    "/updatestudentprofile/:id",
    upload.single("file"),
    updateStudentProfile
);

router.delete(
    "/deletestudentprofile/:id",
    deleteStudentProfile
);


export default router;