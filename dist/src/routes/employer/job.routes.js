"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const job_controller_1 = require("../../controllers/employer/job.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const asyncHandler_1 = require("../../utils/asyncHandler");
const router = (0, express_1.Router)();
router.get("/", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("EMPLOYER"), (0, asyncHandler_1.asyncHandler)(job_controller_1.getEmployerJobsController));
router.post("/", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("EMPLOYER"), (0, asyncHandler_1.asyncHandler)(job_controller_1.createEmployerJobController));
router.get("/:id", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("EMPLOYER"), (0, asyncHandler_1.asyncHandler)(job_controller_1.getEmployerJobByIdController));
router.patch("/:id", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("EMPLOYER"), (0, asyncHandler_1.asyncHandler)(job_controller_1.updateEmployerJobController));
router.patch("/:id/close", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("EMPLOYER"), (0, asyncHandler_1.asyncHandler)(job_controller_1.closeEmployerJobController));
exports.default = router;
//# sourceMappingURL=job.routes.js.map