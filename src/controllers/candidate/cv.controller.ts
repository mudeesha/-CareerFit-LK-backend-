import { Request, Response } from "express";
import { analyzeCvSchema } from "../../dtos/candidate/cv.dto";
import {
  analyzeCvService,
  getMyCvAnalysesService,
  getMyLatestCvAnalysisService,
  uploadAndAnalyzeCvService,
} from "../../services/candidate/cv.service";
import { sendSuccess } from "../../utils/apiResponse";
import { AppError } from "../../utils/appError";

function getAuthUserId(req: Request) {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("UNAUTHORIZED", "Authentication required", 401);
  }

  return userId;
}

export async function analyzeCvController(req: Request, res: Response) {
  const userId = getAuthUserId(req);
  const data = analyzeCvSchema.parse(req.body);

  const analysis = await analyzeCvService(userId, data);

  return sendSuccess(res, analysis, "CV analyzed successfully", 201);
}

export async function uploadAndAnalyzeCvController(req: Request, res: Response) {
  const userId = getAuthUserId(req);

  if (!req.file) {
    throw new AppError("CV_FILE_REQUIRED", "CV file is required", 400);
  }

  const analysis = await uploadAndAnalyzeCvService(userId, req.file);

  return sendSuccess(res, analysis, "CV uploaded and analyzed successfully", 201);
}

export async function getMyLatestCvAnalysisController(
  req: Request,
  res: Response
) {
  const userId = getAuthUserId(req);

  const analysis = await getMyLatestCvAnalysisService(userId);

  return sendSuccess(res, analysis);
}

export async function getMyCvAnalysesController(req: Request, res: Response) {
  const userId = getAuthUserId(req);

  const data = await getMyCvAnalysesService(userId);

  return sendSuccess(res, data);
}