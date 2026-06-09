import { Request, Response } from "express";
import {
  adminCompanyParamSchema,
  rejectCompanySchema,
  suspendCompanySchema,
} from "../../dtos/admin/company.dto";
import {
  approveCompanyService,
  getPendingCompaniesService,
  rejectCompanyService,
  suspendCompanyService,
} from "../../services/admin/company.service";
import { sendSuccess } from "../../utils/apiResponse";
import { AppError } from "../../utils/appError";

function getAuthUserId(req: Request) {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("UNAUTHORIZED", "Authentication required", 401);
  }

  return userId;
}

function getCompanyIdParam(req: Request) {
  const { id } = adminCompanyParamSchema.parse(req.params);
  return id;
}

export async function getPendingCompaniesController(
  req: Request,
  res: Response
) {
  getAuthUserId(req);

  const data = await getPendingCompaniesService();

  return sendSuccess(res, data);
}

export async function approveCompanyController(req: Request, res: Response) {
  const adminUserId = getAuthUserId(req);
  const companyId = getCompanyIdParam(req);

  const company = await approveCompanyService(adminUserId, companyId);

  return sendSuccess(res, company, "Company approved successfully");
}

export async function rejectCompanyController(req: Request, res: Response) {
  const adminUserId = getAuthUserId(req);
  const companyId = getCompanyIdParam(req);
  const data = rejectCompanySchema.parse(req.body);

  const company = await rejectCompanyService(
    adminUserId,
    companyId,
    data.reason
  );

  return sendSuccess(res, company, "Company rejected successfully");
}

export async function suspendCompanyController(req: Request, res: Response) {
  const adminUserId = getAuthUserId(req);
  const companyId = getCompanyIdParam(req);
  const data = suspendCompanySchema.parse(req.body);

  const company = await suspendCompanyService(
    adminUserId,
    companyId,
    data.reason
  );

  return sendSuccess(res, company, "Company suspended successfully");
}