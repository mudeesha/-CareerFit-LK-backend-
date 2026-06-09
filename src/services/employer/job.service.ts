import { CompanyStatus, JobStatus } from "@prisma/client";
import {
  CreateEmployerJobDto,
  UpdateEmployerJobDto,
} from "../../dtos/employer/job.dto";
import {
  closeEmployerJobRecord,
  createEmployerJobRecord,
  findCategoryById,
  findEmployerByUserId,
  findEmployerJobById,
  findEmployerJobs,
  updateEmployerJobRecord,
} from "../../repositories/employer/job.repository";
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

  if (employer.company.status !== CompanyStatus.APPROVED) {
    throw new AppError(
      "COMPANY_NOT_APPROVED",
      "Company must be approved before managing jobs",
      403
    );
  }

  return employer.company;
}

async function validateCategory(categoryId?: string) {
  if (!categoryId) return;

  const category = await findCategoryById(categoryId);

  if (!category) {
    throw new AppError("CATEGORY_NOT_FOUND", "Category not found", 404);
  }
}

function validateSalaryRange(salaryMin?: number, salaryMax?: number) {
  if (
    salaryMin !== undefined &&
    salaryMax !== undefined &&
    salaryMin > salaryMax
  ) {
    throw new AppError(
      "INVALID_SALARY_RANGE",
      "Minimum salary cannot be greater than maximum salary",
      400
    );
  }
}

export async function getEmployerJobsService(userId: string) {
  const company = await getEmployerCompanyOrFail(userId);

  const jobs = await findEmployerJobs(company.id);

  return {
    items: jobs,
    count: jobs.length,
  };
}

export async function createEmployerJobService(
  userId: string,
  data: CreateEmployerJobDto
) {
  const company = await getEmployerCompanyOrFail(userId);

  await validateCategory(data.categoryId);
  validateSalaryRange(data.salaryMin, data.salaryMax);

  return createEmployerJobRecord(company.id, data);
}

export async function getEmployerJobByIdService(userId: string, jobId: string) {
  const company = await getEmployerCompanyOrFail(userId);

  const job = await findEmployerJobById(company.id, jobId);

  if (!job) {
    throw new AppError("JOB_NOT_FOUND", "Job not found", 404);
  }

  return job;
}

export async function updateEmployerJobService(
  userId: string,
  jobId: string,
  data: UpdateEmployerJobDto
) {
  const company = await getEmployerCompanyOrFail(userId);

  const job = await findEmployerJobById(company.id, jobId);

  if (!job) {
    throw new AppError("JOB_NOT_FOUND", "Job not found", 404);
  }

  if (job.status === JobStatus.CLOSED) {
    throw new AppError("JOB_CLOSED", "Closed jobs cannot be updated", 400);
  }

  await validateCategory(data.categoryId);

  validateSalaryRange(
    data.salaryMin ?? job.salaryMin,
    data.salaryMax ?? job.salaryMax
  );

  return updateEmployerJobRecord(job.id, data);
}

export async function closeEmployerJobService(userId: string, jobId: string) {
  const company = await getEmployerCompanyOrFail(userId);

  const job = await findEmployerJobById(company.id, jobId);

  if (!job) {
    throw new AppError("JOB_NOT_FOUND", "Job not found", 404);
  }

  if (job.status === JobStatus.CLOSED) {
    throw new AppError("JOB_ALREADY_CLOSED", "Job is already closed", 400);
  }

  return closeEmployerJobRecord(job.id);
}