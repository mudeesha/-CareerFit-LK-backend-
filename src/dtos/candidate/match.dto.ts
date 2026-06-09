export interface MatchBreakdownDto {
  skills: number;
  experience: number;
  location: number;
  salary: number;
  language: number;
}

export interface JobMatchResponseDto {
  jobId: string;
  candidateId: string;
  overallScore: number;
  matchLabel: "Strong Match" | "Good Match" | "Low Match";
  applyReadiness: "READY_TO_APPLY" | "IMPROVE_CV_FIRST" | "NOT_RECOMMENDED_YET";
  breakdown: MatchBreakdownDto;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  learningPath: string[];
}