"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const appError_1 = require("../utils/appError");
const apiResponse_1 = require("../utils/apiResponse");
function errorHandler(error, _req, res, _next) {
    console.error(error);
    if (error instanceof appError_1.AppError) {
        return (0, apiResponse_1.sendError)(res, error.code, error.message, error.statusCode);
    }
    return (0, apiResponse_1.sendError)(res, "INTERNAL_SERVER_ERROR", "Something went wrong", 500);
}
//# sourceMappingURL=errorHandler.js.map