import { UserRole } from "@prisma/client";
import {
  UpdateCandidateProfileDto,
  UpdateEmployerProfileDto,
} from "../dtos/profile.dto";
import {
  findCandidateProfileByUserId,
  findEmployerProfileByUserId,
  updateCandidateProfileByUserId,
  updateEmployerProfileByUserId,
} from "../repositories/profile.repository";
import { AppError } from "../utils/appError";

export async function getMyProfileService(userId: string, role: UserRole) {
  if (role === "CANDIDATE") {
    const profile = await findCandidateProfileByUserId(userId);

    if (!profile) {
      throw new AppError("PROFILE_NOT_FOUND", "Candidate profile not found", 404);
    }

    return {
      profileType: "CANDIDATE",
      profile,
    };
  }

  if (role === "EMPLOYER") {
    const profile = await findEmployerProfileByUserId(userId);

    if (!profile) {
      throw new AppError("PROFILE_NOT_FOUND", "Employer profile not found", 404);
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

export async function updateMyProfileService(
  userId: string,
  role: UserRole,
  data: UpdateCandidateProfileDto | UpdateEmployerProfileDto
) {
  if (role === "CANDIDATE") {
    const profile = await updateCandidateProfileByUserId(
      userId,
      data as UpdateCandidateProfileDto
    );

    if (!profile) {
      throw new AppError("PROFILE_NOT_FOUND", "Candidate profile not found", 404);
    }

    return {
      profileType: "CANDIDATE",
      profile,
    };
  }

  if (role === "EMPLOYER") {
    const profile = await updateEmployerProfileByUserId(
      userId,
      data as UpdateEmployerProfileDto
    );

    if (!profile) {
      throw new AppError("PROFILE_NOT_FOUND", "Employer profile not found", 404);
    }

    return {
      profileType: "EMPLOYER",
      profile,
    };
  }

  throw new AppError("PROFILE_UPDATE_NOT_ALLOWED", "Profile update is not allowed", 403);
}