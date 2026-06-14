"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const company_controller_1 = require("../../controllers/public/company.controller");
const asyncHandler_1 = require("../../utils/asyncHandler");
const router = (0, express_1.Router)();
router.get("/", (0, asyncHandler_1.asyncHandler)(company_controller_1.getCompaniesController));
router.get("/:id", (0, asyncHandler_1.asyncHandler)(company_controller_1.getCompanyByIdController));
exports.default = router;
//# sourceMappingURL=company.routes.js.map