"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobsController = getJobsController;
exports.getJobByIdController = getJobByIdController;
const job_dto_1 = require("../../dtos/public/job.dto");
const job_service_1 = require("../../services/public/job.service");
const apiResponse_1 = require("../../utils/apiResponse");
async function getJobsController(req, res) {
    const filters = job_dto_1.getJobsQuerySchema.parse(req.query);
    const data = await (0, job_service_1.getJobsService)(filters);
    return (0, apiResponse_1.sendSuccess)(res, data);
}
async function getJobByIdController(req, res) {
    const { id } = job_dto_1.jobIdParamSchema.parse(req.params);
    const job = await (0, job_service_1.getJobByIdService)(id);
    return (0, apiResponse_1.sendSuccess)(res, job);
}
//# sourceMappingURL=job.controller.js.map