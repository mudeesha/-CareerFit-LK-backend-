"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInterviewSchema = exports.scheduleInterviewSchema = exports.employerInterviewParamSchema = exports.employerApplicationInterviewParamSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.employerApplicationInterviewParamSchema = zod_1.z.object({
    id: zod_1.z.string().trim().min(1, "Application ID is required"),
});
exports.employerInterviewParamSchema = zod_1.z.object({
    id: zod_1.z.string().trim().min(1, "Interview ID is required"),
});
exports.scheduleInterviewSchema = zod_1.z.object({
    interviewDate: zod_1.z.string().trim().min(1, "Interview date is required"),
    interviewTime: zod_1.z.string().trim().min(1, "Interview time is required"),
    interviewType: zod_1.z.nativeEnum(client_1.InterviewType),
    locationOrLink: zod_1.z.string().trim().optional(),
    notes: zod_1.z.string().trim().max(2000).optional(),
});
exports.updateInterviewSchema = zod_1.z.object({
    interviewDate: zod_1.z.string().trim().min(1).optional(),
    interviewTime: zod_1.z.string().trim().min(1).optional(),
    interviewType: zod_1.z.nativeEnum(client_1.InterviewType).optional(),
    locationOrLink: zod_1.z.string().trim().optional(),
    notes: zod_1.z.string().trim().max(2000).optional(),
    status: zod_1.z
        .enum([client_1.InterviewStatus.SCHEDULED, client_1.InterviewStatus.COMPLETED])
        .optional(),
});
//# sourceMappingURL=interview.dto.js.map