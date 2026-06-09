import express from "express";
import cors from "cors";
import path from "path";

import jobRoutes from "./routes/public/job.routes";
import companyRoutes from "./routes/public/company.routes";
import categoryRoutes from "./routes/public/category.routes";
import profileRoutes from "./routes/public/profile.routes";
import applicationRoutes from "./routes/candidate/application.routes";
import cvRoutes from "./routes/candidate/cv.routes";
import matchRoutes from "./routes/candidate/match.routes";
import authRoutes from "./routes/auth/auth.routes";
import savedJobRoutes from "./routes/candidate/savedJob.routes";

// employer
import employerJobRoutes from "./routes/employer/job.routes";
import employerApplicantRoutes from "./routes/employer/applicant.routes";
import employerInterviewRoutes from "./routes/employer/interview.routes";

// admin
import adminDashboardRoutes from "./routes/admin/dashboard.routes";
import adminCompanyRoutes from "./routes/admin/company.routes";
import adminJobRoutes from "./routes/admin/job.routes";
import adminUserRoutes from "./routes/admin/user.routes";
import adminActionRoutes from "./routes/admin/action.routes";

import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files publicly
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

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

app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api", matchRoutes);
app.use("/api/saved-jobs", savedJobRoutes);

//Employer
app.use("/api/employer/jobs", employerJobRoutes);
app.use("/api/employer/applicant", employerApplicantRoutes);
app.use("/api/employer/interview", employerInterviewRoutes);

// admin
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/companies", adminCompanyRoutes);
app.use("/api/admin/jobs", adminJobRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/actions", adminActionRoutes);

app.use(errorHandler);

export default app;