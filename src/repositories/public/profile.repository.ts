import { prisma } from "../../lib/prisma";
import {
  UpdateCandidateProfileDto,
  UpdateEmployerProfileDto,
} from "../../dtos/public/profile.dto";

export async function findCandidateProfileByUserId(userId: string) {
  return prisma.candidateProfile.findUnique({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
        },
      },
    },
  });
}

export async function findEmployerProfileByUserId(userId: string) {
  return prisma.employerProfile.findUnique({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
        },
      },
      company: true,
    },
  });
}

export async function updateCandidateProfileByUserId(
  userId: string,
  data: UpdateCandidateProfileDto
) {
  const profile = await findCandidateProfileByUserId(userId);

  if (!profile) {
    return null;
  }

  const nextProfileData = {
    fullName: data.fullName ?? profile.fullName,
    phone: data.phone ?? profile.phone ?? undefined,
    district: data.district ?? profile.district ?? undefined,
    currentRole: data.currentRole ?? profile.currentRole ?? undefined,
    preferredLocations: data.preferredLocations ?? profile.preferredLocations,
    expectedSalary: data.expectedSalary ?? profile.expectedSalary ?? undefined,
    experienceYears: data.experienceYears ?? profile.experienceYears,
    skills: data.skills ?? profile.skills,
    languages: data.languages ?? profile.languages,
    education: data.education ?? profile.education ?? undefined,
    linkedinUrl: data.linkedinUrl ?? profile.linkedinUrl ?? undefined,
    githubUrl: data.githubUrl ?? profile.githubUrl ?? undefined,
    portfolioUrl: data.portfolioUrl ?? profile.portfolioUrl ?? undefined,
    profileImageUrl:
      data.profileImageUrl ?? profile.profileImageUrl ?? undefined,
  };

  return prisma.candidateProfile.update({
    where: {
      userId,
    },
    data: {
      ...nextProfileData,
      profileCompletion: calculateCandidateProfileCompletion(nextProfileData),
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
        },
      },
    },
  });
}

export async function updateEmployerProfileByUserId(
  userId: string,
  data: UpdateEmployerProfileDto
) {
  const profile = await findEmployerProfileByUserId(userId);

  if (!profile) {
    return null;
  }

  return prisma.employerProfile.update({
    where: {
      userId,
    },
    data: {
      fullName: data.fullName ?? profile.fullName,
      position: data.position ?? profile.position ?? undefined,
      phone: data.phone ?? profile.phone ?? undefined,
      companyId: data.companyId ?? profile.companyId ?? undefined,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
        },
      },
      company: true,
    },
  });
}

function calculateCandidateProfileCompletion(data: {
  fullName?: string | null;
  phone?: string | null;
  district?: string | null;
  currentRole?: string | null;
  preferredLocations?: unknown;
  expectedSalary?: number | null;
  experienceYears?: number | null;
  skills?: unknown;
  languages?: unknown;
  education?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
}) {
  const fields = [
    data.fullName,
    data.phone,
    data.district,
    data.currentRole,
    Array.isArray(data.preferredLocations)
      ? data.preferredLocations.length
      : undefined,
    data.expectedSalary,
    data.experienceYears,
    Array.isArray(data.skills) ? data.skills.length : undefined,
    Array.isArray(data.languages) ? data.languages.length : undefined,
    data.education,
    data.linkedinUrl,
    data.githubUrl,
    data.portfolioUrl,
  ];

  const completed = fields.filter(Boolean).length;

  return Math.round((completed / fields.length) * 100);
}