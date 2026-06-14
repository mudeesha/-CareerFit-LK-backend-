"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email("Valid email is required"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    role: zod_1.z.enum(["CANDIDATE", "EMPLOYER"]),
    fullName: zod_1.z.string().min(2, "Full name is required"),
    phone: zod_1.z.string().optional(),
    district: zod_1.z.string().optional(),
    position: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Valid email is required"),
    password: zod_1.z.string().min(1, "Password is required"),
});
//# sourceMappingURL=auth.dto.js.map