import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = path.join("uploads");

// ✅ Ensure uploads folder exists
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

export default upload;