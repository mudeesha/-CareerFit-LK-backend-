import { Request, Response } from "express";
import {
  adminJobParamSchema,
  closeJobSchema,
  featureJobSchema,
  rejectJobSchema,
} from "../../dtos/admin/job.dto";
import {
  approveJobService,
  closeJobService,
  featureJobService,
  getPendingJobsService,
  rejectJobService,
} from "../../services/admin/job.service";
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
  const { id } = adminJobParamSchema.parse(req.params);
  return id;
}

export async function getPendingJobsController(req: Request, res: Response) {
  getAuthUserId(req);

  const data = await getPendingJobsService();

  return sendSuccess(res, data);
}

export async function approveJobController(req: Request, res: Response) {
  const adminUserId = getAuthUserId(req);
  const jobId = getJobIdParam(req);

  const job = await approveJobService(adminUserId, jobId);

  return sendSuccess(res, job, "Job approved successfully");
}

export async function rejectJobController(req: Request, res: Response) {
  const adminUserId = getAuthUserId(req);
  const jobId = getJobIdParam(req);
  const data = rejectJobSchema.parse(req.body);

  const job = await rejectJobService(adminUserId, jobId, data.reason);

  return sendSuccess(res, job, "Job rejected successfully");
}

export async function featureJobController(req: Request, res: Response) {
  const adminUserId = getAuthUserId(req);
  const jobId = getJobIdParam(req);
  const data = featureJobSchema.parse(req.body || {});

  const job = await featureJobService(adminUserId, jobId, data.isFeatured);

  return sendSuccess(
    res,
    job,
    job.isFeatured ? "Job marked as featured" : "Job removed from featured"
  );
}

export async function closeJobController(req: Request, res: Response) {
  const adminUserId = getAuthUserId(req);
  const jobId = getJobIdParam(req);
  const data = closeJobSchema.parse(req.body || {});

  const job = await closeJobService(adminUserId, jobId, data.reason);

  return sendSuccess(res, job, "Job closed successfully");
}