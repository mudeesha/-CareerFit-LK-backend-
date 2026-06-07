import express from "express";
import cors from "cors";

import jobRoutes from "./routes/job.routes";
import companyRoutes from "./routes/company.routes";
import categoryRoutes from "./routes/category.routes";
import profileRoutes from "./routes/profile.routes";
import applicationRoutes from "./routes/application.routes";
import cvRoutes from "./routes/cv.routes";
import matchRoutes from "./routes/match.routes";

import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

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
app.use("/api/companies", companyRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api", matchRoutes);

app.use(errorHandler);

export default app;