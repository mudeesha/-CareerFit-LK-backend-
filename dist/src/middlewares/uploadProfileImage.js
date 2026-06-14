"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfileImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const appError_1 = require("../utils/appError");
const uploadDir = path_1.default.join(process.cwd(), "uploads", "profile-images");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const safeName = path_1.default
            .basename(file.originalname, ext)
            .replace(/[^a-zA-Z0-9-_]/g, "-")
            .toLowerCase();
        cb(null, `${Date.now()}-${safeName}${ext}`);
    },
});
exports.uploadProfileImage = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            cb(new appError_1.AppError("INVALID_FILE_TYPE", "Only JPG, PNG, and WEBP images are allowed", 400));
            return;
        }
        cb(null, true);
    },
});
//# sourceMappingURL=uploadProfileImage.js.map