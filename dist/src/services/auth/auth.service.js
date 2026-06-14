"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerService = registerService;
exports.loginService = loginService;
exports.getMeService = getMeService;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_repository_1 = require("../../repositories/auth/auth.repository");
const appError_1 = require("../../utils/appError");
function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new appError_1.AppError("JWT_SECRET_MISSING", "JWT secret is not configured", 500);
    }
    return secret;
}
function generateToken(userId) {
    const options = {
        expiresIn: (process.env.JWT_EXPIRES_IN || "7d"),
    };
    return jsonwebtoken_1.default.sign({ userId }, getJwtSecret(), options);
}
function sanitizeUser(user) {
    const { password, ...safeUser } = user;
    return safeUser;
}
async function registerService(data) {
    const existingUser = await (0, auth_repository_1.findUserByEmail)(data.email);
    if (existingUser) {
        throw new appError_1.AppError("EMAIL_ALREADY_EXISTS", "Email already exists", 409);
    }
    const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
    const user = await (0, auth_repository_1.createUserWithProfile)({
        email: data.email.toLowerCase(),
        password: hashedPassword,
        role: data.role,
        fullName: data.fullName,
        phone: data.phone,
        district: data.district,
        position: data.position,
    });
    const token = generateToken(user.id);
    return {
        token,
        user: sanitizeUser(user),
    };
}
async function loginService(data) {
    const user = await (0, auth_repository_1.findUserByEmail)(data.email.toLowerCase());
    if (!user || !user.password) {
        throw new appError_1.AppError("INVALID_CREDENTIALS", "Invalid email or password", 401);
    }
    if (user.status !== "ACTIVE") {
        throw new appError_1.AppError("ACCOUNT_DISABLED", "Your account is disabled", 403);
    }
    const isPasswordValid = await bcryptjs_1.default.compare(data.password, user.password);
    if (!isPasswordValid) {
        throw new appError_1.AppError("INVALID_CREDENTIALS", "Invalid email or password", 401);
    }
    const token = generateToken(user.id);
    return {
        token,
        user: sanitizeUser(user),
    };
}
async function getMeService(userId) {
    const user = await (0, auth_repository_1.findUserById)(userId);
    if (!user) {
        throw new appError_1.AppError("USER_NOT_FOUND", "User not found", 404);
    }
    return sanitizeUser(user);
}
//# sourceMappingURL=auth.service.js.map