"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("../../controllers/public/profile.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const asyncHandler_1 = require("../../utils/asyncHandler");
const profile_controller_2 = require("../../controllers/public/profile.controller");
const uploadProfileImage_1 = require("../../middlewares/uploadProfileImage");
const router = (0, express_1.Router)();
router.get("/me", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, asyncHandler_1.asyncHandler)(profile_controller_1.getMyProfileController));
router.patch("/me", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), (0, asyncHandler_1.asyncHandler)(profile_controller_1.updateMyProfileController));
router.post("/me/avatar", (0, asyncHandler_1.asyncHandler)(auth_middleware_1.authenticate), uploadProfileImage_1.uploadProfileImage.single("avatar"), (0, asyncHandler_1.asyncHandler)(profile_controller_2.uploadMyProfileAvatarController));
exports.default = router;
//# sourceMappingURL=profile.routes.js.map