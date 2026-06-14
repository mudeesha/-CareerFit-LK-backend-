"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCategories = findCategories;
const prisma_1 = require("../../lib/prisma");
async function findCategories() {
    return prisma_1.prisma.category.findMany({
        orderBy: {
            name: "asc",
        },
    });
}
//# sourceMappingURL=category.repository.js.map