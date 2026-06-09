import { Prisma, UserRole } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      candidateProfile: true,
      employerProfile: true,
    },
  });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      candidateProfile: true,
      employerProfile: true,
    },
  });
}

export async function createUserWithProfile(data: {
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
  phone?: string;
  district?: string;
  position?: string;
}) {
  return prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      role: data.role,
      candidateProfile:
        data.role === "CANDIDATE"
          ? {
              create: {
                fullName: data.fullName,
                phone: data.phone,
                district: data.district,
                profileCompletion: 20,
                skills: [],
                languages: [],
                preferredLocations: [],
              },
            }
          : undefined,
      employerProfile:
        data.role === "EMPLOYER"
          ? {
              create: {
                fullName: data.fullName,
                phone: data.phone,
                position: data.position,
              },
            }
          : undefined,
    } satisfies Prisma.UserCreateInput,
    include: {
      candidateProfile: true,
      employerProfile: true,
    },
  });
}