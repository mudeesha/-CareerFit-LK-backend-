import { Request, Response } from "express";
import { getJobMatchService } from "../../services/candidate/match.service";
import { sendSuccess } from "../../utils/apiResponse";
import { AppError } from "../../utils/appError";

function getAuthUserId(req: Request) {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("UNAUTHORIZED", "Authentication required", 401);
  }

  return userId;
}

export async function getJobMatchController(req: Request, res: Response) {
  const userId = getAuthUserId(req);
  const jobId = req.params.id;

  if (!jobId || Array.isArray(jobId)) {
    throw new AppError("INVALID_JOB_ID", "Invalid job ID", 400);
  }

  const match = await getJobMatchService(userId, jobId);

  return sendSuccess(res, match);
}