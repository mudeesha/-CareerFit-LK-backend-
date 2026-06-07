import { Request, Response } from "express";
import { getJobMatchService } from "../services/match.service";
import { sendError, sendSuccess } from "../utils/apiResponse";

export async function getJobMatchController(req: Request, res: Response) {
  const jobId = req.params.id;

  if (!jobId || Array.isArray(jobId)) {
    return sendError(res, "INVALID_JOB_ID", "Invalid job ID", 400);
  }

  const match = await getJobMatchService(jobId);

  return sendSuccess(res, match);
}