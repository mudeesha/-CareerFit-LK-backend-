import { Request, Response } from "express";
import {
  updateCandidateProfileSchema,
  updateEmployerProfileSchema,
} from "../dtos/profile.dto";
import {
  getMyProfileService,
  updateMyProfileService,
} from "../services/profile.service";
import { sendSuccess } from "../utils/apiResponse";
import { AppError } from "../utils/appError";

function getAuthUser(req: Request) {
  const user = req.user;

  if (!user) {
    throw new AppError("UNAUTHORIZED", "Authentication required", 401);
  }

  return user;
}

export async function getMyProfileController(req: Request, res: Response) {
  const user = getAuthUser(req);

  const profile = await getMyProfileService(user.id, user.role);

  return sendSuccess(res, profile);
}

export async function updateMyProfileController(req: Request, res: Response) {
  const user = getAuthUser(req);

  if (user.role === "CANDIDATE") {
    const data = updateCandidateProfileSchema.parse(req.body);

    const profile = await updateMyProfileService(user.id, user.role, data);

    return sendSuccess(res, profile, "Candidate profile updated successfully");
  }

  if (user.role === "EMPLOYER") {
    const data = updateEmployerProfileSchema.parse(req.body);

    const profile = await updateMyProfileService(user.id, user.role, data);

    return sendSuccess(res, profile, "Employer profile updated successfully");
  }

  throw new AppError("PROFILE_UPDATE_NOT_ALLOWED", "Profile update is not allowed", 403);
}