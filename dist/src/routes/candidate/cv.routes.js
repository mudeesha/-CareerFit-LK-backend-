"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cv_controller_1 = require("../../controllers/candidate/cv.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const uploadCv_1 = require("../../middlewares/uploadCv");
const asyncHandler_1 = require("../../utils/asyncHandler");
const router = (0, express_1.Router)();
router.post("/analyze", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("CANDIDATE"), (0, asyncHandler_1.asyncHandler)(cv_controller_1.analyzeCvController));
router.post("/upload", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("CANDIDATE"), uploadCv_1.uploadCv.single("cv"), (0, asyncHandler_1.asyncHandler)(cv_controller_1.uploadAndAnalyzeCvController));
router.get("/analysis/me", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("CANDIDATE"), (0, asyncHandler_1.asyncHandler)(cv_controller_1.getMyLatestCvAnalysisController));
router.get("/analyses/me", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, auth_middleware_1.authorizeRoles)("CANDIDATE"), (0, asyncHandler_1.asyncHandler)(cv_controller_1.getMyCvAnalysesController));
exports.default = router;
//# sourceMappingURL=cv.routes.js.map