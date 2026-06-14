"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorizeRoles = authorizeRoles;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_repository_1 = require("../repositories/auth/auth.repository");
const appError_1 = require("../utils/appError");
async function authenticate(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new appError_1.AppError("UNAUTHORIZED", "Authentication required", 401);
    }
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new appError_1.AppError("JWT_SECRET_MISSING", "JWT secret is not configured", 500);
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const user = await (0, auth_repository_1.findUserById)(decoded.userId);
        if (!user) {
            throw new appError_1.AppError("UNAUTHORIZED", "Invalid token user", 401);
        }
        if (user.status !== "ACTIVE") {
            throw new appError_1.AppError("ACCOUNT_DISABLED", "Your account is disabled", 403);
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        next();
    }
    catch (error) {
        if (error instanceof appError_1.AppError) {
            throw error;
        }
        throw new appError_1.AppError("UNAUTHORIZED", "Invalid or expired token", 401);
    }
}
function authorizeRoles(...roles) {
    return (req, _res, next) => {
        if (!req.user) {
            throw new appError_1.AppError("UNAUTHORIZED", "Authentication required", 401);
        }
        if (!roles.includes(req.user.role)) {
            throw new appError_1.AppError("FORBIDDEN", "You do not have permission", 403);
        }
        next();
    };
}
//# sourceMappingURL=auth.middleware.js.map