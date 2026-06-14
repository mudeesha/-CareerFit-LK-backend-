import { prisma } from "../../lib/prisma";
import { UploadCvAnalysisDto } from "../../dtos/candidate/cv.dto";

export async function findCandidateForCvByUserId(userId: string) {
  return prisma.candidateProfile.findUnique({
    where: { userId },
  });
}

export async function findCvSkillSources() {
  const [jobs, categories] = await Promise.all([
    prisma.job.findMany({
      where: { status: "ACTIVE" },
      select: {
        skills: true,
        preferredSkills: true,
      },
    }),
    prisma.category.findMany({
      select: {
        topSkills: true,
      },
    }),
  ]);

  return { jobs, categories };
}

export async function createCvAnalysisRecord(
  candidateId: string,
  data: UploadCvAnalysisDto
) {
  return prisma.cvAnalysis.create({
    data: {
      candidateId,
      fileName: data.fileName,
      fileUrl: data.fileUrl || `/uploads/${data.fileName}`,
      strengthScore: 0,
      extractedSkills: data.extractedSkills ?? [],
      missingSkills: [],
      experienceYears: data.experienceYears ?? 0,
      education: data.education ?? [],
      languages: data.languages ?? [],
      suggestions: [],
    },
  });
}

export async function findMyLatestCvAnalysis(candidateId: string) {
  return prisma.cvAnalysis.findFirst({
    where: { candidateId },
    orderBy: { createdAt: "desc" },
  });
}

export async function findMyCvAnalyses(candidateId: string) {
  return prisma.cvAnalysis.findMany({
    where: { candidateId },
    orderBy: { createdAt: "desc" },
  });
}