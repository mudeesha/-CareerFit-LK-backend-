import multer from "multer";
import path from "path";
import fs from "fs";
import { AppError } from "../utils/appError";

const uploadDir = path.join(process.cwd(), "uploads", "profile-images");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    cb(null, `${Date.now()}-${safeName}${ext}`);
  },
});

export const uploadProfileImage = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(
        new AppError(
          "INVALID_FILE_TYPE",
          "Only JPG, PNG, and WEBP images are allowed",
          400
        )
      );
      return;
    }

    cb(null, true);
  },
});