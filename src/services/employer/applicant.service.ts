import { ApplicationStatus, CompanyStatus } from "@prisma/client";
import {
  findApplicantsByJobId,
  findApplicationForEmployer,
  findEmployerByUserId,
  findEmployerJobById,
  updateApplicationStatusRecord,
} from "../../repositories/employer/applicant.repository";
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
      "Company must be approved before managing applicants",
      403
    );
  }

  return employer.company;
}

async function getEmployerApplicationOrFail(
  userId: string,
  applicationId: string
) {
  const company = await getEmployerCompanyOrFail(userId);

  const application = await findApplicationForEmployer(company.id, applicationId);

  if (!application) {
    throw new AppError("APPLICATION_NOT_FOUND", "Application not found", 404);
  }

  if (application.status === ApplicationStatus.WITHDRAWN) {
    throw new AppError(
      "APPLICATION_WITHDRAWN",
      "Withdrawn applications cannot be updated",
      400
    );
  }

  return application;
}

export async function getEmployerJobApplicantsService(
  userId: string,
  jobId: string
) {
  const company = await getEmployerCompanyOrFail(userId);

  const job = await findEmployerJobById(company.id, jobId);

  if (!job) {
    throw new AppError("JOB_NOT_FOUND", "Job not found", 404);
  }

  const applicants = await findApplicantsByJobId(job.id);

  return {
    job,
    items: applicants,
    count: applicants.length,
  };
}

export async function markApplicationViewedService(
  userId: string,
  applicationId: string
) {
  const application = await getEmployerApplicationOrFail(userId, applicationId);

  if (application.status !== ApplicationStatus.APPLIED) {
    return application;
  }

  return updateApplicationStatusRecord(
    application.id,
    ApplicationStatus.VIEWED
  );
}

export async function shortlistApplicationService(
  userId: string,
  applicationId: string
) {
  const application = await getEmployerApplicationOrFail(userId, applicationId);

  if (
    application.status === ApplicationStatus.REJECTED ||
    application.status === ApplicationStatus.HIRED
  ) {
    throw new AppError(
      "INVALID_APPLICATION_STATUS",
      "Rejected or hired applications cannot be shortlisted",
      400
    );
  }

  return updateApplicationStatusRecord(
    application.id,
    ApplicationStatus.SHORTLISTED
  );
}

export async function rejectApplicationService(
  userId: string,
  applicationId: string
) {
  const application = await getEmployerApplicationOrFail(userId, applicationId);

  if (application.status === ApplicationStatus.HIRED) {
    throw new AppError(
      "APPLICATION_ALREADY_HIRED",
      "Hired applications cannot be rejected",
      400
    );
  }

  return updateApplicationStatusRecord(
    application.id,
    ApplicationStatus.REJECTED
  );
}

export async function hireApplicationService(
  userId: string,
  applicationId: string
) {
  const application = await getEmployerApplicationOrFail(userId, applicationId);

  if (application.status === ApplicationStatus.REJECTED) {
    throw new AppError(
      "APPLICATION_REJECTED",
      "Rejected applications cannot be hired",
      400
    );
  }

  return updateApplicationStatusRecord(
    application.id,
    ApplicationStatus.HIRED
  );
}