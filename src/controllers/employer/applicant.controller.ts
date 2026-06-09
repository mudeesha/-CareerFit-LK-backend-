import { Request, Response } from "express";
import {
  employerApplicationParamSchema,
  employerJobApplicantParamSchema,
  rejectApplicationSchema,
} from "../../dtos/employer/applicant.dto";
import {
  getEmployerJobApplicantsService,
  hireApplicationService,
  markApplicationViewedService,
  rejectApplicationService,
  shortlistApplicationService,
} from "../../services/employer/applicant.service";
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
  const { id } = employerJobApplicantParamSchema.parse(req.params);
  return id;
}

function getApplicationIdParam(req: Request) {
  const { id } = employerApplicationParamSchema.parse(req.params);
  return id;
}

export async function getEmployerJobApplicantsController(
  req: Request,
  res: Response
) {
  const userId = getAuthUserId(req);
  const jobId = getJobIdParam(req);

  const data = await getEmployerJobApplicantsService(userId, jobId);

  return sendSuccess(res, data);
}

export async function markApplicationViewedController(
  req: Request,
  res: Response
) {
  const userId = getAuthUserId(req);
  const applicationId = getApplicationIdParam(req);

  const application = await markApplicationViewedService(userId, applicationId);

  return sendSuccess(res, application, "Application marked as viewed");
}

export async function shortlistApplicationController(
  req: Request,
  res: Response
) {
  const userId = getAuthUserId(req);
  const applicationId = getApplicationIdParam(req);

  const application = await shortlistApplicationService(userId, applicationId);

  return sendSuccess(res, application, "Applicant shortlisted successfully");
}

export async function rejectApplicationController(req: Request, res: Response) {
  const userId = getAuthUserId(req);
  const applicationId = getApplicationIdParam(req);

  rejectApplicationSchema.parse(req.body);

  const application = await rejectApplicationService(userId, applicationId);

  return sendSuccess(res, application, "Applicant rejected successfully");
}

export async function hireApplicationController(req: Request, res: Response) {
  const userId = getAuthUserId(req);
  const applicationId = getApplicationIdParam(req);

  const application = await hireApplicationService(userId, applicationId);

  return sendSuccess(res, application, "Applicant hired successfully");
}