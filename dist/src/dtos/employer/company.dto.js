"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEmployerCompanySchema = void 0;
const zod_1 = require("zod");
exports.updateEmployerCompanySchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, "Company name is required").optional(),
    logoText: zod_1.z.string().trim().min(1, "Logo text is required").optional(),
    logoType: zod_1.z.string().trim().min(1, "Logo type is required").optional(),
    logoColor: zod_1.z.string().trim().min(1, "Logo color is required").optional(),
    industry: zod_1.z.string().trim().min(1, "Industry is required").optional(),
    location: zod_1.z.string().trim().min(1, "Location is required").optional(),
    size: zod_1.z.string().trim().optional(),
    website: zod_1.z.string().trim().optional(),
    description: zod_1.z.string().trim().optional(),
    contactEmail: zod_1.z.string().trim().email("Invalid contact email").optional(),
    phone: zod_1.z.string().trim().optional(),
});
//# sourceMappingURL=company.dto.js.map