import { Request, Response } from "express";
import { updateProfileSchema } from "../dtos/profile.dto";
import {
  getMyProfileService,
  updateMyProfileService,
} from "../services/profile.service";
import { sendSuccess } from "../utils/apiResponse";

export async function getMyProfileController(_req: Request, res: Response) {
  const profile = await getMyProfileService();

  return sendSuccess(res, profile);
}

export async function updateMyProfileController(req: Request, res: Response) {
  const data = updateProfileSchema.parse(req.body);

  const profile = await updateMyProfileService(data);

  return sendSuccess(res, profile, "Profile updated successfully");
}