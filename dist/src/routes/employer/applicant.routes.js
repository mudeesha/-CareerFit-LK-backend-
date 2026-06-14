"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const applicant_controller_1 = require("../../controllers/employer/applicant.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const asyncHandler_1 = require("../../utils/asyncHandler");
const router = (0, express_1.Router)();
router.get("/jobs/:id/applicants", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("EMPLOYER"), (0, asyncHandler_1.asyncHandler)(applicant_controller_1.getEmployerJobApplicantsController));
router.patch("/applications/:id/viewed", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("EMPLOYER"), (0, asyncHandler_1.asyncHandler)(applicant_controller_1.markApplicationViewedController));
router.patch("/applications/:id/shortlist", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("EMPLOYER"), (0, asyncHandler_1.asyncHandler)(applicant_controller_1.shortlistApplicationController));
router.patch("/applications/:id/reject", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("EMPLOYER"), (0, asyncHandler_1.asyncHandler)(applicant_controller_1.rejectApplicationController));
router.patch("/applications/:id/hire", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("EMPLOYER"), (0, asyncHandler_1.asyncHandler)(applicant_controller_1.hireApplicationController));
exports.default = router;
//# sourceMappingURL=applicant.routes.js.map