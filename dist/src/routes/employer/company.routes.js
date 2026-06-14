"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const company_controller_1 = require("../../controllers/employer/company.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const asyncHandler_1 = require("../../utils/asyncHandler");
const router = (0, express_1.Router)();
router.get("/", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("EMPLOYER"), (0, asyncHandler_1.asyncHandler)(company_controller_1.getEmployerCompanyController));
router.patch("/", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("EMPLOYER"), (0, asyncHandler_1.asyncHandler)(company_controller_1.updateEmployerCompanyController));
exports.default = router;
//# sourceMappingURL=company.routes.js.map