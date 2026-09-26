// server/routes/export.routes.js

// Defines authenticated export endpoints.
// Delegates health report generation to the export controller.

import express from "express";

import auth from "../middlewares/auth.js";
import { generateHealthReport } from "../controllers/exportController.js";

const router = express.Router();

// Register the health report export route.
router.get("/health-report", auth, generateHealthReport);

// Export the configured router.
export default router;
