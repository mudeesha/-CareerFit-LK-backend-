import { Request, Response } from "express";
import { analyzeCvSchema } from "../dtos/cv.dto";
import {
  analyzeCvService,
  getMyCvAnalysesService,
  getMyLatestCvAnalysisService,
} from "../services/cv.service";
import { sendSuccess } from "../utils/apiResponse";

export async function analyzeCvController(req: Request, res: Response) {
  const data = analyzeCvSchema.parse(req.body);

  const analysis = await analyzeCvService(data);

  return sendSuccess(res, analysis, "CV analyzed successfully", 201);
}

export async function getMyLatestCvAnalysisController(
  _req: Request,
  res: Response
) {
  const analysis = await getMyLatestCvAnalysisService();

  return sendSuccess(res, analysis);
}

export async function getMyCvAnalysesController(_req: Request, res: Response) {
  const data = await getMyCvAnalysesService();

  return sendSuccess(res, data);
}