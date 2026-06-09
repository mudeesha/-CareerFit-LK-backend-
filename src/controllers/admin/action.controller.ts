import { Request, Response } from "express";
import { getAdminActionsQuerySchema } from "../../dtos/admin/action.dto";
import { getAdminActionsService } from "../../services/admin/action.service";
import { sendSuccess } from "../../utils/apiResponse";
import { AppError } from "../../utils/appError";

function getAuthUserId(req: Request) {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("UNAUTHORIZED", "Authentication required", 401);
  }

  return userId;
}

export async function getAdminActionsController(req: Request, res: Response) {
  getAuthUserId(req);

  const filters = getAdminActionsQuerySchema.parse(req.query);
  const data = await getAdminActionsService(filters);

  return sendSuccess(res, data);
}