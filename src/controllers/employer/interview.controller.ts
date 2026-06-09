import { Request, Response } from "express";
import {
  employerApplicationInterviewParamSchema,
  employerInterviewParamSchema,
  scheduleInterviewSchema,
  updateInterviewSchema,
} from "../../dtos/employer/interview.dto";
import {
  cancelInterviewService,
  scheduleInterviewService,
  updateInterviewService,
} from "../../services/employer/interview.service";
import { sendSuccess } from "../../utils/apiResponse";
import { AppError } from "../../utils/appError";

function getAuthUserId(req: Request) {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("UNAUTHORIZED", "Authentication required", 401);
  }

  return userId;
}

function getApplicationIdParam(req: Request) {
  const { id } = employerApplicationInterviewParamSchema.parse(req.params);
  return id;
}

function getInterviewIdParam(req: Request) {
  const { id } = employerInterviewParamSchema.parse(req.params);
  return id;
}

export async function scheduleInterviewController(req: Request, res: Response) {
  const userId = getAuthUserId(req);
  const applicationId = getApplicationIdParam(req);
  const data = scheduleInterviewSchema.parse(req.body);

  const interview = await scheduleInterviewService(userId, applicationId, data);

  return sendSuccess(res, interview, "Interview scheduled successfully", 201);
}

export async function updateInterviewController(req: Request, res: Response) {
  const userId = getAuthUserId(req);
  const interviewId = getInterviewIdParam(req);
  const data = updateInterviewSchema.parse(req.body);

  const interview = await updateInterviewService(userId, interviewId, data);

  return sendSuccess(res, interview, "Interview updated successfully");
}

export async function cancelInterviewController(req: Request, res: Response) {
  const userId = getAuthUserId(req);
  const interviewId = getInterviewIdParam(req);

  const interview = await cancelInterviewService(userId, interviewId);

  return sendSuccess(res, interview, "Interview cancelled successfully");
}