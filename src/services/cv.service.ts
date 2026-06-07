import { AnalyzeCvDto } from "../dtos/cv.dto";
import {
  createCvAnalysisRecord,
  findDemoCandidateForCv,
  findMyCvAnalyses,
  findMyLatestCvAnalysis,
} from "../repositories/cv.repository";
import { AppError } from "../utils/appError";

export async function analyzeCvService(data: AnalyzeCvDto) {
  const candidate = await findDemoCandidateForCv();

  if (!candidate) {
    throw new AppError("CANDIDATE_NOT_FOUND", "Candidate profile not found", 404);
  }

  return createCvAnalysisRecord(candidate.id, data);
}

export async function getMyLatestCvAnalysisService() {
  const candidate = await findDemoCandidateForCv();

  if (!candidate) {
    throw new AppError("CANDIDATE_NOT_FOUND", "Candidate profile not found", 404);
  }

  const analysis = await findMyLatestCvAnalysis(candidate.id);

  if (!analysis) {
    throw new AppError("CV_ANALYSIS_NOT_FOUND", "CV analysis not found", 404);
  }

  return analysis;
}

export async function getMyCvAnalysesService() {
  const candidate = await findDemoCandidateForCv();

  if (!candidate) {
    throw new AppError("CANDIDATE_NOT_FOUND", "Candidate profile not found", 404);
  }

  const analyses = await findMyCvAnalyses(candidate.id);

  return {
    items: analyses,
    count: analyses.length,
  };
}