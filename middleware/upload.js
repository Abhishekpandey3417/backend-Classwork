/*import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = path.join("uploads");


if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {

        const cleanName = file.originalname.replace(/\s+/g, "_");

        // unique filename
        const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}-${cleanName}`;

        cb(null, uniqueName);
    }
});



const fileFilter = (req, file, cb) => {

    console.log("UPLOAD FILE:", file.originalname);
    console.log("MIME TYPE:", file.mimetype);

    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".pdf"
    ];

    const ext = path.extname(file.originalname).toLowerCase();

    // ✅ Allow by extension
    if (allowedExtensions.includes(ext)) {
        return cb(null, true);
    }

    // ✅ Allow by MIME type
    if (
        file.mimetype.startsWith("image/") ||
        file.mimetype === "application/pdf" ||
        file.mimetype === "application/octet-stream"
    ) {
        return cb(null, true);
    }

    // ❌ Reject invalid files
    return cb(
        new Error("Only JPG, PNG and PDF files are allowed"),
        false
    );
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

export default upload;*/


import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

// 2. Use CloudinaryStorage instead of diskStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "syllabus_uploads", // Folder in Cloudinary
    resource_type: "auto",      // Crucial: "auto" allows both images AND pdfs!
    public_id: (req, file) => {
      const cleanName = file.originalname.replace(/\.\w+$/, "").replace(/\s+/g, "_");
      return `${Date.now()}-${cleanName}`;
    },
  },
});

const fileFilter = (req, file, cb) => {
    console.log("UPLOAD FILE:", file.originalname);
    console.log("MIME TYPE:", file.mimetype);

    const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(ext) || file.mimetype.startsWith("image/") || file.mimetype === "application/pdf" || file.mimetype === "application/octet-stream") {
        return cb(null, true);
    }
    return cb(new Error("Only JPG, PNG and PDF files are allowed"), false);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

export default upload;