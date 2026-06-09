import { Request, Response } from "express";
import { savedJobParamSchema } from "../../dtos/candidate/savedJob.dto";
import {
  getMySavedJobsService,
  removeSavedJobService,
  saveJobService,
} from "../../services/candidate/savedJob.service";
import { sendSuccess } from "../../utils/apiResponse";
import { AppError } from "../../utils/appError";

function getAuthUserId(req: Request) {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("UNAUTHORIZED", "Authentication required", 401);
  }

  return userId;
}

function getJobIdParam(req: Request) {
  const { jobId } = savedJobParamSchema.parse(req.params);
  return jobId;
}

export async function saveJobController(req: Request, res: Response) {
  const userId = getAuthUserId(req);
  const jobId = getJobIdParam(req);

  const savedJob = await saveJobService(userId, jobId);

  return sendSuccess(res, savedJob, "Job saved successfully", 201);
}

export async function getMySavedJobsController(req: Request, res: Response) {
  const userId = getAuthUserId(req);

  const data = await getMySavedJobsService(userId);

  return sendSuccess(res, data);
}

export async function removeSavedJobController(req: Request, res: Response) {
  const userId = getAuthUserId(req);
  const jobId = getJobIdParam(req);

  const result = await removeSavedJobService(userId, jobId);

  return sendSuccess(res, result, "Saved job removed successfully");
}