import { AnalyzeCvDto } from "../../dtos/candidate/cv.dto";
import {
  createCvAnalysisRecord,
  findCandidateForCvByUserId,
  findMyCvAnalyses,
  findMyLatestCvAnalysis,
} from "../../repositories/candidate/cv.repository";
import { AppError } from "../../utils/appError";

async function getCandidateOrFail(userId: string) {
  const candidate = await findCandidateForCvByUserId(userId);

  if (!candidate) {
    throw new AppError("CANDIDATE_NOT_FOUND", "Candidate profile not found", 404);
  }

  return candidate;
}

export async function analyzeCvService(userId: string, data: AnalyzeCvDto) {
  const candidate = await getCandidateOrFail(userId);

  return createCvAnalysisRecord(candidate.id, data);
}

export async function uploadAndAnalyzeCvService(
  userId: string,
  file: Express.Multer.File
) {
  const candidate = await getCandidateOrFail(userId);

  return createCvAnalysisRecord(candidate.id, {
    fileName: file.originalname,
    fileUrl: `/uploads/cvs/${file.filename}`,
  });
}

export async function getMyLatestCvAnalysisService(userId: string) {
  const candidate = await getCandidateOrFail(userId);

  const analysis = await findMyLatestCvAnalysis(candidate.id);

  if (!analysis) {
    throw new AppError("CV_ANALYSIS_NOT_FOUND", "CV analysis not found", 404);
  }

  return analysis;
}

export async function getMyCvAnalysesService(userId: string) {
  const candidate = await getCandidateOrFail(userId);

  const analyses = await findMyCvAnalyses(candidate.id);

  return {
    items: analyses,
    count: analyses.length,
  };
}