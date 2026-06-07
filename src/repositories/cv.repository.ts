import { prisma } from "../lib/prisma";
import { AnalyzeCvDto } from "../dtos/cv.dto";

const DEMO_CANDIDATE_EMAIL = "nimal.perera@example.com";

export async function findDemoCandidateForCv() {
  return prisma.candidateProfile.findFirst({
    where: {
      user: {
        email: DEMO_CANDIDATE_EMAIL,
      },
    },
  });
}

export async function createCvAnalysisRecord(
  candidateId: string,
  data: AnalyzeCvDto
) {
  return prisma.cvAnalysis.create({
    data: {
      candidateId,
      fileName: data.fileName,
      fileUrl: data.fileUrl || `/uploads/${data.fileName}`,
      strengthScore: 72,
      extractedSkills: [
        "React",
        "JavaScript",
        "Node.js",
        "REST API",
        "MySQL",
        "Git",
      ],
      missingSkills: ["TypeScript", "AWS Lambda", "DynamoDB"],
      experienceYears: 1.5,
      education: ["BSc in Information Technology"],
      languages: ["Sinhala", "English"],
      suggestions: [
        "Add measurable achievements",
        "Add TypeScript and AWS keywords",
        "Include GitHub and portfolio links",
        "Add project impact numbers",
      ],
    },
  });
}

export async function findMyLatestCvAnalysis(candidateId: string) {
  return prisma.cvAnalysis.findFirst({
    where: {
      candidateId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function findMyCvAnalyses(candidateId: string) {
  return prisma.cvAnalysis.findMany({
    where: {
      candidateId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}