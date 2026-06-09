import { Request, Response } from "express";
import { getEmployerDashboardService } from "../../services/employer/dashboard.service";
import { sendSuccess } from "../../utils/apiResponse";
import { AppError } from "../../utils/appError";

function getAuthUserId(req: Request) {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("UNAUTHORIZED", "Authentication required", 401);
  }

  return userId;
}

export async function getEmployerDashboardController(
  req: Request,
  res: Response
) {
  const userId = getAuthUserId(req);

  const dashboard = await getEmployerDashboardService(userId);

  return sendSuccess(res, dashboard);
}