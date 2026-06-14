"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCompanies = findCompanies;
exports.findCompanyById = findCompanyById;
const prisma_1 = require("../../lib/prisma");
async function findCompanies() {
    return prisma_1.prisma.company.findMany({
        orderBy: {
            name: "asc",
        },
    });
}
async function findCompanyById(id) {
    return prisma_1.prisma.company.findUnique({
        where: {
            id,
        },
        include: {
            jobs: {
                include: {
                    category: true,
                },
            },
        },
    });
}
//# sourceMappingURL=company.repository.js.map