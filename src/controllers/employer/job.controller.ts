import { Request, Response } from "express";
import {
  createEmployerJobSchema,
  employerJobParamSchema,
  updateEmployerJobSchema,
} from "../../dtos/employer/job.dto";
import {
  closeEmployerJobService,
  createEmployerJobService,
  getEmployerJobByIdService,
  getEmployerJobsService,
  updateEmployerJobService,
} from "../../services/employer/job.service";
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
  const { id } = employerJobParamSchema.parse(req.params);
  return id;
}

export async function getEmployerJobsController(req: Request, res: Response) {
  const userId = getAuthUserId(req);

  const data = await getEmployerJobsService(userId);

  return sendSuccess(res, data);
}

export async function createEmployerJobController(req: Request, res: Response) {
  const userId = getAuthUserId(req);
  const data = createEmployerJobSchema.parse(req.body);

  const job = await createEmployerJobService(userId, data);

  return sendSuccess(res, job, "Job created successfully", 201);
}

export async function getEmployerJobByIdController(
  req: Request,
  res: Response
) {
  const userId = getAuthUserId(req);
  const jobId = getJobIdParam(req);

  const job = await getEmployerJobByIdService(userId, jobId);

  return sendSuccess(res, job);
}

export async function updateEmployerJobController(req: Request, res: Response) {
  const userId = getAuthUserId(req);
  const jobId = getJobIdParam(req);
  const data = updateEmployerJobSchema.parse(req.body);

  const job = await updateEmployerJobService(userId, jobId, data);

  return sendSuccess(res, job, "Job updated successfully");
}

export async function closeEmployerJobController(req: Request, res: Response) {
  const userId = getAuthUserId(req);
  const jobId = getJobIdParam(req);

  const job = await closeEmployerJobService(userId, jobId);

  return sendSuccess(res, job, "Job closed successfully");
}