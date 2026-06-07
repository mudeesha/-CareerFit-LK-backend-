import { Request, Response } from "express";
import { getJobsQuerySchema } from "../dtos/job.dto";
import { getJobByIdService, getJobsService } from "../services/job.service";
import { sendSuccess } from "../utils/apiResponse";

export async function getJobsController(req: Request, res: Response) {
  const filters = getJobsQuerySchema.parse(req.query);
  const data = await getJobsService(filters);

  return sendSuccess(res, data);
}

export async function getJobByIdController(req: Request, res: Response) {
  const job = await getJobByIdService(req.params.id);

  return sendSuccess(res, job);
}