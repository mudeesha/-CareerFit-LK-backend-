"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoriesController = getCategoriesController;
const category_service_1 = require("../../services/public/category.service");
const apiResponse_1 = require("../../utils/apiResponse");
async function getCategoriesController(_req, res) {
    const data = await (0, category_service_1.getCategoriesService)();
    return (0, apiResponse_1.sendSuccess)(res, data);
}
//# sourceMappingURL=category.controller.js.map