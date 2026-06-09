import { UserRole, UserStatus } from "@prisma/client";
import { GetAdminUsersQueryDto } from "../../dtos/admin/user.dto";
import {
  findAdminUsers,
  findUserForAdminById,
  updateUserStatusRecord,
} from "../../repositories/admin/user.repository";
import { AppError } from "../../utils/appError";

async function getUserOrFail(userId: string) {
  const user = await findUserForAdminById(userId);

  if (!user) {
    throw new AppError("USER_NOT_FOUND", "User not found", 404);
  }

  return user;
}

export async function getAdminUsersService(filters: GetAdminUsersQueryDto) {
  const users = await findAdminUsers(filters);

  return {
    items: users,
    count: users.length,
  };
}

export async function disableUserService(
  adminUserId: string,
  targetUserId: string
) {
  const user = await getUserOrFail(targetUserId);

  if (user.id === adminUserId) {
    throw new AppError(
      "CANNOT_DISABLE_SELF",
      "You cannot disable your own account",
      400
    );
  }

  if (user.role === UserRole.ADMIN) {
    throw new AppError(
      "CANNOT_DISABLE_ADMIN",
      "Admin users cannot be disabled from this endpoint",
      400
    );
  }

  if (user.status === UserStatus.DISABLED) {
    throw new AppError("USER_ALREADY_DISABLED", "User is already disabled", 400);
  }

  return updateUserStatusRecord(user.id, UserStatus.DISABLED);
}

export async function enableUserService(
  adminUserId: string,
  targetUserId: string
) {
  const user = await getUserOrFail(targetUserId);

  if (user.id === adminUserId) {
    throw new AppError(
      "CANNOT_ENABLE_SELF",
      "You cannot enable your own account from this endpoint",
      400
    );
  }

  if (user.status === UserStatus.ACTIVE) {
    throw new AppError("USER_ALREADY_ACTIVE", "User is already active", 400);
  }

  return updateUserStatusRecord(user.id, UserStatus.ACTIVE);
}