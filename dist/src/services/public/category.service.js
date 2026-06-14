"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoriesService = getCategoriesService;
const category_repository_1 = require("../../repositories/public/category.repository");
async function getCategoriesService() {
    const categories = await (0, category_repository_1.findCategories)();
    return {
        items: categories,
        count: categories.length,
    };
}
//# sourceMappingURL=category.service.js.map