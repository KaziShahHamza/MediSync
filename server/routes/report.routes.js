// server/routes/report.routes.js

// Defines authenticated routes for medical report management.

import express from "express";

import auth from "../middlewares/auth.js";

import {
  getReports,
  createReport,
  analyzeReport,
  deleteReport,
} from "../controllers/reportController.js";

const router = express.Router();

// Register report collection routes.
router.get("/", auth, getReports);
router.post("/", auth, createReport);

// Register report analysis and deletion routes.
router.post("/:id/analyze", auth, analyzeReport);
router.delete("/:id", auth, deleteReport);

export default router;
