"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyProfileService = getMyProfileService;
exports.updateMyProfileService = updateMyProfileService;
const profile_repository_1 = require("../../repositories/public/profile.repository");
const appError_1 = require("../../utils/appError");
async function getMyProfileService(userId, role) {
    if (role === "CANDIDATE") {
        const profile = await (0, profile_repository_1.findCandidateProfileByUserId)(userId);
        if (!profile) {
            throw new appError_1.AppError("PROFILE_NOT_FOUND", "Candidate profile not found", 404);
        }
        return {
            profileType: "CANDIDATE",
            profile,
        };
    }
    if (role === "EMPLOYER") {
        const profile = await (0, profile_repository_1.findEmployerProfileByUserId)(userId);
        if (!profile) {
            throw new appError_1.AppError("PROFILE_NOT_FOUND", "Employer profile not found", 404);
        }
        return {
            profileType: "EMPLOYER",
            profile,
        };
    }
    return {
        profileType: "ADMIN",
        profile: null,
    };
}
async function updateMyProfileService(userId, role, data) {
    if (role === "CANDIDATE") {
        const profile = await (0, profile_repository_1.updateCandidateProfileByUserId)(userId, data);
        if (!profile) {
            throw new appError_1.AppError("PROFILE_NOT_FOUND", "Candidate profile not found", 404);
        }
        return {
            profileType: "CANDIDATE",
            profile,
        };
    }
    if (role === "EMPLOYER") {
        const profile = await (0, profile_repository_1.updateEmployerProfileByUserId)(userId, data);
        if (!profile) {
            throw new appError_1.AppError("PROFILE_NOT_FOUND", "Employer profile not found", 404);
        }
        return {
            profileType: "EMPLOYER",
            profile,
        };
    }
    throw new appError_1.AppError("PROFILE_UPDATE_NOT_ALLOWED", "Profile update is not allowed", 403);
}
//# sourceMappingURL=profile.service.js.map