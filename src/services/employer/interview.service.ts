import { ApplicationStatus, CompanyStatus, InterviewStatus } from "@prisma/client";
import {
  ScheduleInterviewDto,
  UpdateInterviewDto,
} from "../../dtos/employer/interview.dto";
import {
  cancelInterviewRecord,
  createInterviewRecord,
  findApplicationForEmployer,
  findEmployerByUserId,
  findInterviewForEmployer,
  updateApplicationStatusToInterviewScheduled,
  updateInterviewRecord,
} from "../../repositories/employer/interview.repository";
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
      "Company must be approved before managing interviews",
      403
    );
  }

  return employer.company;
}

export async function scheduleInterviewService(
  userId: string,
  applicationId: string,
  data: ScheduleInterviewDto
) {
  const company = await getEmployerCompanyOrFail(userId);

  const application = await findApplicationForEmployer(company.id, applicationId);

  if (!application) {
    throw new AppError("APPLICATION_NOT_FOUND", "Application not found", 404);
  }

  if (application.status === ApplicationStatus.WITHDRAWN) {
    throw new AppError(
      "APPLICATION_WITHDRAWN",
      "Withdrawn applications cannot be scheduled for interview",
      400
    );
  }

  if (application.status === ApplicationStatus.REJECTED) {
    throw new AppError(
      "APPLICATION_REJECTED",
      "Rejected applications cannot be scheduled for interview",
      400
    );
  }

  if (application.status === ApplicationStatus.HIRED) {
    throw new AppError(
      "APPLICATION_HIRED",
      "Hired applications cannot be scheduled for interview",
      400
    );
  }

  if (application.interview) {
    throw new AppError(
      "INTERVIEW_ALREADY_EXISTS",
      "Interview already exists for this application. Please update the interview instead.",
      409
    );
  }

  const interview = await createInterviewRecord(application.id, data);

  await updateApplicationStatusToInterviewScheduled(application.id);

  return interview;
}

export async function updateInterviewService(
  userId: string,
  interviewId: string,
  data: UpdateInterviewDto
) {
  const company = await getEmployerCompanyOrFail(userId);

  const interview = await findInterviewForEmployer(company.id, interviewId);

  if (!interview) {
    throw new AppError("INTERVIEW_NOT_FOUND", "Interview not found", 404);
  }

  if (interview.status === InterviewStatus.CANCELLED) {
    throw new AppError(
      "INTERVIEW_CANCELLED",
      "Cancelled interviews cannot be updated",
      400
    );
  }

  return updateInterviewRecord(interview.id, data);
}

export async function cancelInterviewService(userId: string, interviewId: string) {
  const company = await getEmployerCompanyOrFail(userId);

  const interview = await findInterviewForEmployer(company.id, interviewId);

  if (!interview) {
    throw new AppError("INTERVIEW_NOT_FOUND", "Interview not found", 404);
  }

  if (interview.status === InterviewStatus.CANCELLED) {
    throw new AppError(
      "INTERVIEW_ALREADY_CANCELLED",
      "Interview is already cancelled",
      400
    );
  }

  return cancelInterviewRecord(interview.id);
}