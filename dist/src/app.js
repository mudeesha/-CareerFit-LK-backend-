"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const job_routes_1 = __importDefault(require("./routes/public/job.routes"));
const company_routes_1 = __importDefault(require("./routes/public/company.routes"));
const category_routes_1 = __importDefault(require("./routes/public/category.routes"));
const profile_routes_1 = __importDefault(require("./routes/public/profile.routes"));
const application_routes_1 = __importDefault(require("./routes/candidate/application.routes"));
const cv_routes_1 = __importDefault(require("./routes/candidate/cv.routes"));
const match_routes_1 = __importDefault(require("./routes/candidate/match.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth/auth.routes"));
const savedJob_routes_1 = __importDefault(require("./routes/candidate/savedJob.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/candidate/dashboard.routes"));
// employer
const job_routes_2 = __importDefault(require("./routes/employer/job.routes"));
const applicant_routes_1 = __importDefault(require("./routes/employer/applicant.routes"));
const interview_routes_1 = __importDefault(require("./routes/employer/interview.routes"));
const dashboard_routes_2 = __importDefault(require("./routes/employer/dashboard.routes"));
const company_routes_2 = __importDefault(require("./routes/employer/company.routes"));
// admin
const dashboard_routes_3 = __importDefault(require("./routes/admin/dashboard.routes"));
const company_routes_3 = __importDefault(require("./routes/admin/company.routes"));
const job_routes_3 = __importDefault(require("./routes/admin/job.routes"));
const user_routes_1 = __importDefault(require("./routes/admin/user.routes"));
const action_routes_1 = __importDefault(require("./routes/admin/action.routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve uploaded files publicly
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "Welcome to CareerFit LK API",
        health: "/health",
    });
});
app.get("/health", (_req, res) => {
    res.json({
        success: true,
        message: "CareerFit LK API is running",
    });
});
app.use("/api/jobs", job_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use("/api/companies", company_routes_1.default);
app.use("/api/categories", category_routes_1.default);
app.use("/api/profile", profile_routes_1.default);
app.use("/api/applications", application_routes_1.default);
app.use("/api/cv", cv_routes_1.default);
app.use("/api", match_routes_1.default);
app.use("/api/saved-jobs", savedJob_routes_1.default);
app.use("/api/candidate/dashboard", dashboard_routes_1.default);
//Employer
app.use("/api/employer/jobs", job_routes_2.default);
app.use("/api/employer/applicant", applicant_routes_1.default);
app.use("/api/employer/interview", interview_routes_1.default);
app.use("/api/employer/dashboard", dashboard_routes_2.default);
app.use("/api/employer/company", company_routes_2.default);
// admin
app.use("/api/admin/dashboard", dashboard_routes_3.default);
app.use("/api/admin/companies", company_routes_3.default);
app.use("/api/admin/jobs", job_routes_3.default);
app.use("/api/admin/users", user_routes_1.default);
app.use("/api/admin/actions", action_routes_1.default);
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map