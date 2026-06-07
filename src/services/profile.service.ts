import { UpdateProfileDto } from "../dtos/profile.dto";
import {
  findDemoCandidateProfile,
  updateDemoCandidateProfile,
} from "../repositories/profile.repository";
import { AppError } from "../utils/appError";

export async function getMyProfileService() {
  const profile = await findDemoCandidateProfile();

  if (!profile) {
    throw new AppError("PROFILE_NOT_FOUND", "Candidate profile not found", 404);
  }

  return profile;
}

export async function updateMyProfileService(data: UpdateProfileDto) {
  const profile = await updateDemoCandidateProfile(data);

  if (!profile) {
    throw new AppError("PROFILE_NOT_FOUND", "Candidate profile not found", 404);
  }

  return profile;
}