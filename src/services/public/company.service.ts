import {
  findCompanies,
  findCompanyById,
} from "../../repositories/public/company.repository";
import { AppError } from "../../utils/appError";

export async function getCompaniesService() {
  const companies = await findCompanies();

  return {
    items: companies,
    count: companies.length,
  };
}

export async function getCompanyByIdService(id: string) {
  const company = await findCompanyById(id);

  if (!company) {
    throw new AppError("COMPANY_NOT_FOUND", "Company not found", 404);
  }

  return company;
}