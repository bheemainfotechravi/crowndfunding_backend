
import multer from "multer";
import path from "path";
import fs from "fs";

// ================= CREATE FOLDER =================
const createFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// ================= STORAGE =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "uploads/";

    // 🔥 Dynamic folder selection
    if (file.fieldname === "image") {
      uploadPath = "uploads/images/";
    } else if (file.fieldname === "document") {
      uploadPath = "uploads/documents/";
    }

    // ✅ Ensure folder exists
    createFolder(uploadPath);

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const ext = path.extname(file.originalname).toLowerCase();

    cb(null, uniqueName + ext);
  },
});

// ================= FILE FILTER =================
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  // ✅ IMAGE VALIDATION
  if (file.fieldname === "image") {
    const allowedImages = [".jpg", ".jpeg", ".png", ".webp"];

    if (!allowedImages.includes(ext)) {
      return cb(
        new Error("Only image files (jpg, png, webp) allowed"),
        false
      );
    }
  }

  // ✅ DOCUMENT VALIDATION
 if (file.fieldname === "document") {
  const allowedDocs = [
    // 📄 Documents
    ".pdf",
    ".doc",
    ".docx",

    // 🖼️ Images (added)
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
  ];

  if (!allowedDocs.includes(ext)) {
    return cb(
      new Error("Only PDF, DOC, DOCX, JPG, PNG, WEBP files allowed"),
      false
    );
  }
}

  cb(null, true);
};

// ================= MULTER INSTANCE =================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;