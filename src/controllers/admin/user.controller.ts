import { Request, Response } from "express";
import {
  adminUserParamSchema,
  getAdminUsersQuerySchema,
} from "../../dtos/admin/user.dto";
import {
  disableUserService,
  enableUserService,
  getAdminUsersService,
} from "../../services/admin/user.service";
import { sendSuccess } from "../../utils/apiResponse";
import { AppError } from "../../utils/appError";

function getAuthUserId(req: Request) {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("UNAUTHORIZED", "Authentication required", 401);
  }

  return userId;
}

function getUserIdParam(req: Request) {
  const { id } = adminUserParamSchema.parse(req.params);
  return id;
}

export async function getAdminUsersController(req: Request, res: Response) {
  getAuthUserId(req);

  const filters = getAdminUsersQuerySchema.parse(req.query);
  const data = await getAdminUsersService(filters);

  return sendSuccess(res, data);
}

export async function disableUserController(req: Request, res: Response) {
  const adminUserId = getAuthUserId(req);
  const targetUserId = getUserIdParam(req);

  const user = await disableUserService(adminUserId, targetUserId);

  return sendSuccess(res, user, "User disabled successfully");
}

export async function enableUserController(req: Request, res: Response) {
  const adminUserId = getAuthUserId(req);
  const targetUserId = getUserIdParam(req);

  const user = await enableUserService(adminUserId, targetUserId);

  return sendSuccess(res, user, "User enabled successfully");
}