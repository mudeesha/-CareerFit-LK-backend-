"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyProfileController = getMyProfileController;
exports.updateMyProfileController = updateMyProfileController;
exports.uploadMyProfileAvatarController = uploadMyProfileAvatarController;
const profile_dto_1 = require("../../dtos/public/profile.dto");
const profile_service_1 = require("../../services/public/profile.service");
const apiResponse_1 = require("../../utils/apiResponse");
const appError_1 = require("../../utils/appError");
function getAuthUser(req) {
    const user = req.user;
    if (!user) {
        throw new appError_1.AppError("UNAUTHORIZED", "Authentication required", 401);
    }
    return user;
}
async function getMyProfileController(req, res) {
    const user = getAuthUser(req);
    const profile = await (0, profile_service_1.getMyProfileService)(user.id, user.role);
    return (0, apiResponse_1.sendSuccess)(res, profile);
}
async function updateMyProfileController(req, res) {
    const user = getAuthUser(req);
    if (user.role === "CANDIDATE") {
        const data = profile_dto_1.updateCandidateProfileSchema.parse(req.body);
        const profile = await (0, profile_service_1.updateMyProfileService)(user.id, user.role, data);
        return (0, apiResponse_1.sendSuccess)(res, profile, "Candidate profile updated successfully");
    }
    if (user.role === "EMPLOYER") {
        const data = profile_dto_1.updateEmployerProfileSchema.parse(req.body);
        const profile = await (0, profile_service_1.updateMyProfileService)(user.id, user.role, data);
        return (0, apiResponse_1.sendSuccess)(res, profile, "Employer profile updated successfully");
    }
    throw new appError_1.AppError("PROFILE_UPDATE_NOT_ALLOWED", "Profile update is not allowed", 403);
}
async function uploadMyProfileAvatarController(req, res) {
    const user = getAuthUser(req);
    if (user.role !== "CANDIDATE") {
        throw new appError_1.AppError("PROFILE_IMAGE_NOT_ALLOWED", "Only candidates can upload profile images", 403);
    }
    if (!req.file) {
        throw new appError_1.AppError("IMAGE_REQUIRED", "Profile image is required", 400);
    }
    const profileImageUrl = `/uploads/profile-images/${req.file.filename}`;
    const profile = await (0, profile_service_1.updateMyProfileService)(user.id, user.role, {
        profileImageUrl,
    });
    return (0, apiResponse_1.sendSuccess)(res, profile, "Profile image uploaded successfully");
}
//# sourceMappingURL=profile.controller.js.map