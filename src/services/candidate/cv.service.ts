import fs from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import {
  createCvAnalysisRecord,
  findCandidateForCvByUserId,
  findCvSkillSources,
  findMyCvAnalyses,
  findMyLatestCvAnalysis,
} from "../../repositories/candidate/cv.repository";
import { AppError } from "../../utils/appError";

const LANGUAGE_KEYWORDS = ["Sinhala", "English", "Tamil"];

async function getCandidateOrFail(userId: string) {
  const candidate = await findCandidateForCvByUserId(userId);

  if (!candidate) {
    throw new AppError(
      "CANDIDATE_NOT_FOUND",
      "Candidate profile not found",
      404
    );
  }

  return candidate;
}

function normalizeSkill(skill: string) {
  return skill.trim().replace(/\s+/g, " ");
}

function addJsonSkillsToSet(skillSet: Set<string>, value: unknown) {
  if (!Array.isArray(value)) return;

  for (const skill of value) {
    if (typeof skill === "string" && skill.trim()) {
      skillSet.add(normalizeSkill(skill));
    }
  }
}

async function getSkillKeywordsFromDatabase() {
  const { jobs, categories } = await findCvSkillSources();
  const skillSet = new Set<string>();

  for (const job of jobs) {
    addJsonSkillsToSet(skillSet, job.skills);
    addJsonSkillsToSet(skillSet, job.preferredSkills);
  }

  for (const category of categories) {
    addJsonSkillsToSet(skillSet, category.topSkills);
  }

  return Array.from(skillSet);
}

async function extractTextFromCv(file: Express.Multer.File) {
  const fileBuffer = await fs.readFile(file.path);
  const extension = path.extname(file.originalname).toLowerCase();

  if (extension === ".pdf") {
    const parsed = await pdfParse(fileBuffer);

    return parsed.text;
  }

  if (extension === ".docx") {
    const parsed = await mammoth.extractRawText({
      buffer: fileBuffer,
    });

    return parsed.value;
  }

  throw new AppError(
    "UNSUPPORTED_CV_FILE",
    "Only PDF and DOCX files can be parsed",
    400
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function includesSkill(text: string, skill: string) {
  const pattern = new RegExp(
    `(^|[^a-zA-Z0-9])${escapeRegExp(skill)}([^a-zA-Z0-9]|$)`,
    "i"
  );

  return pattern.test(text);
}

function detectSkills(text: string, skillKeywords: string[]) {
  return skillKeywords.filter((skill) => includesSkill(text, skill));
}

function detectLanguages(text: string) {
  return LANGUAGE_KEYWORDS.filter((language) => includesSkill(text, language));
}

function detectEducation(text: string) {
  const education: string[] = [];

  if (/\bbsc\b|bachelor|degree/i.test(text)) {
    education.push("Bachelor Degree");
  }

  if (/\bmsc\b|master/i.test(text)) {
    education.push("Master Degree");
  }

  if (/diploma/i.test(text)) {
    education.push("Diploma");
  }

  if (/certificate|certification/i.test(text)) {
    education.push("Certification");
  }

  return education;
}

function detectExperienceYears(text: string) {
  const matches = [
    ...text.matchAll(/(\d+(?:\.\d+)?)\s*\+?\s*(?:years|year|yrs|yr)/gi),
  ];

  if (matches.length === 0) return 0;

  const years = matches
    .map((match) => Number(match[1]))
    .filter((value) => !Number.isNaN(value));

  return years.length ? Math.max(...years) : 0;
}

async function extractCvDetails(file: Express.Multer.File) {
  const text = await extractTextFromCv(file);
  const skillKeywords = await getSkillKeywordsFromDatabase();

  return {
    extractedSkills: detectSkills(text, skillKeywords),
    experienceYears: detectExperienceYears(text),
    education: detectEducation(text),
    languages: detectLanguages(text),
  };
}

export async function uploadAndAnalyzeCvService(
  userId: string,
  file: Express.Multer.File
) {
  const candidate = await getCandidateOrFail(userId);
  const extractedDetails = await extractCvDetails(file);

  return createCvAnalysisRecord(candidate.id, {
    fileName: file.originalname,
    fileUrl: `/uploads/cvs/${file.filename}`,
    ...extractedDetails,
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