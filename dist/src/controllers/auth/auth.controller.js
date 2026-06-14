"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = registerController;
exports.loginController = loginController;
exports.getMeController = getMeController;
const auth_dto_1 = require("../../dtos/auth/auth.dto");
const auth_service_1 = require("../../services/auth/auth.service");
const appError_1 = require("../../utils/appError");
const apiResponse_1 = require("../../utils/apiResponse");
async function registerController(req, res) {
    const data = auth_dto_1.registerSchema.parse(req.body);
    const result = await (0, auth_service_1.registerService)(data);
    return (0, apiResponse_1.sendSuccess)(res, result, "Registration successful", 201);
}
async function loginController(req, res) {
    const data = auth_dto_1.loginSchema.parse(req.body);
    const result = await (0, auth_service_1.loginService)(data);
    return (0, apiResponse_1.sendSuccess)(res, result, "Login successful");
}
async function getMeController(req, res) {
    if (!req.user) {
        throw new appError_1.AppError("UNAUTHORIZED", "Authentication required", 401);
    }
    const user = await (0, auth_service_1.getMeService)(req.user.id);
    return (0, apiResponse_1.sendSuccess)(res, user);
}
//# sourceMappingURL=auth.controller.js.map