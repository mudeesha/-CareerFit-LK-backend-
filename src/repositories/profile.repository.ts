import { prisma } from "../lib/prisma";
import { UpdateProfileDto } from "../dtos/profile.dto";

const DEMO_CANDIDATE_EMAIL = "nimal.perera@example.com";

export async function findDemoCandidateProfile() {
  return prisma.candidateProfile.findFirst({
    where: {
      user: {
        email: DEMO_CANDIDATE_EMAIL,
      },
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

export async function updateDemoCandidateProfile(data: UpdateProfileDto) {
  const profile = await findDemoCandidateProfile();

  if (!profile) {
    return null;
  }

  return prisma.candidateProfile.update({
    where: {
      id: profile.id,
    },
    data: {
      fullName: data.fullName,
      phone: data.phone,
      district: data.district,
      currentRole: data.currentRole,
      preferredLocations: data.preferredLocations,
      expectedSalary: data.expectedSalary,
      experienceYears: data.experienceYears,
      skills: data.skills,
      languages: data.languages,
      education: data.education,
      linkedinUrl: data.linkedinUrl,
      githubUrl: data.githubUrl,
      portfolioUrl: data.portfolioUrl,
      profileImageUrl: data.profileImageUrl,
      profileCompletion: calculateProfileCompletion(data),
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

function calculateProfileCompletion(data: UpdateProfileDto) {
  const fields = [
    data.fullName,
    data.phone,
    data.district,
    data.currentRole,
    data.expectedSalary,
    data.experienceYears,
    data.skills?.length,
    data.languages?.length,
    data.education,
    data.linkedinUrl,
    data.githubUrl,
    data.portfolioUrl,
  ];

  const completed = fields.filter(Boolean).length;

  return Math.round((completed / fields.length) * 100);
}