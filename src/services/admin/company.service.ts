import { AdminActionType, CompanyStatus } from "@prisma/client";
import {
  createCompanyAdminActionRecord,
  findCompanyById,
  findPendingCompanies,
  updateCompanyStatusRecord,
} from "../../repositories/admin/company.repository";
import { AppError } from "../../utils/appError";

async function getCompanyOrFail(companyId: string) {
  const company = await findCompanyById(companyId);

  if (!company) {
    throw new AppError("COMPANY_NOT_FOUND", "Company not found", 404);
  }

  return company;
}

export async function getPendingCompaniesService() {
  const companies = await findPendingCompanies();

  return {
    items: companies,
    count: companies.length,
  };
}

export async function approveCompanyService(
  adminUserId: string,
  companyId: string
) {
  const company = await getCompanyOrFail(companyId);

  if (company.status === CompanyStatus.APPROVED) {
    throw new AppError(
      "COMPANY_ALREADY_APPROVED",
      "Company is already approved",
      400
    );
  }

  if (company.status === CompanyStatus.SUSPENDED) {
    throw new AppError(
      "COMPANY_SUSPENDED",
      "Suspended company cannot be approved directly",
      400
    );
  }

  const updatedCompany = await updateCompanyStatusRecord(
    company.id,
    CompanyStatus.APPROVED
  );

  await createCompanyAdminActionRecord({
    adminUserId,
    companyId: company.id,
    action: AdminActionType.APPROVED,
  });

  return updatedCompany;
}

export async function rejectCompanyService(
  adminUserId: string,
  companyId: string,
  reason: string
) {
  const company = await getCompanyOrFail(companyId);

  if (company.status === CompanyStatus.REJECTED) {
    throw new AppError(
      "COMPANY_ALREADY_REJECTED",
      "Company is already rejected",
      400
    );
  }

  if (company.status === CompanyStatus.APPROVED) {
    throw new AppError(
      "COMPANY_ALREADY_APPROVED",
      "Approved company cannot be rejected. Suspend it instead.",
      400
    );
  }

  const updatedCompany = await updateCompanyStatusRecord(
    company.id,
    CompanyStatus.REJECTED
  );

  await createCompanyAdminActionRecord({
    adminUserId,
    companyId: company.id,
    action: AdminActionType.REJECTED,
    reason,
  });

  return updatedCompany;
}

export async function suspendCompanyService(
  adminUserId: string,
  companyId: string,
  reason: string
) {
  const company = await getCompanyOrFail(companyId);

  if (company.status === CompanyStatus.SUSPENDED) {
    throw new AppError(
      "COMPANY_ALREADY_SUSPENDED",
      "Company is already suspended",
      400
    );
  }

  if (company.status === CompanyStatus.REJECTED) {
    throw new AppError(
      "COMPANY_REJECTED",
      "Rejected company cannot be suspended",
      400
    );
  }

  const updatedCompany = await updateCompanyStatusRecord(
    company.id,
    CompanyStatus.SUSPENDED
  );

  await createCompanyAdminActionRecord({
    adminUserId,
    companyId: company.id,
    action: AdminActionType.SUSPENDED,
    reason,
  });

  return updatedCompany;
}