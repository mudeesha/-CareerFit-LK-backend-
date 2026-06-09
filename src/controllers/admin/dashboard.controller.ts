import { Request, Response } from "express";
import { getAdminDashboardService } from "../../services/admin/dashboard.service";
import { sendSuccess } from "../../utils/apiResponse";
import { AppError } from "../../utils/appError";

function getAuthUserId(req: Request) {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("UNAUTHORIZED", "Authentication required", 401);
  }

  return userId;
}

export async function getAdminDashboardController(req: Request, res: Response) {
  getAuthUserId(req);

  const dashboard = await getAdminDashboardService();

  return sendSuccess(res, dashboard);
}