import { CompanyStatus } from "@prisma/client";
import { UpdateEmployerCompanyDto } from "../../dtos/employer/company.dto";
import {
  findEmployerByUserId,
  findEmployerCompanyById,
  updateEmployerCompanyRecord,
} from "../../repositories/employer/company.repository";
import { AppError } from "../../utils/appError";

async function getEmployerCompanyOrFail(userId: string) {
  const employer = await findEmployerByUserId(userId);

  if (!employer) {
    throw new AppError("EMPLOYER_NOT_FOUND", "Employer profile not found", 404);
  }

  if (!employer.companyId || !employer.company) {
    throw new AppError(
      "COMPANY_NOT_FOUND",
      "Employer is not linked to a company",
      400
    );
  }

  return employer.company;
}

export async function getEmployerCompanyService(userId: string) {
  const company = await getEmployerCompanyOrFail(userId);

  return company;
}

export async function updateEmployerCompanyService(
  userId: string,
  data: UpdateEmployerCompanyDto
) {
  const company = await getEmployerCompanyOrFail(userId);

  if (company.status === CompanyStatus.SUSPENDED) {
    throw new AppError(
      "COMPANY_SUSPENDED",
      "Suspended company profile cannot be updated",
      403
    );
  }

  const latestCompany = await findEmployerCompanyById(company.id);

  if (!latestCompany) {
    throw new AppError("COMPANY_NOT_FOUND", "Company not found", 404);
  }

  return updateEmployerCompanyRecord(latestCompany.id, data);
}