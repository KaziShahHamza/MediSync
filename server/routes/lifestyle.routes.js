// server/routes/lifestyle.routes.js

// Defines authenticated lifestyle assessment endpoints.
// Delegates request handling to the lifestyle controller.

import express from "express";

import auth from "../middlewares/auth.js";
import {
  createLifestyleAssessment,
  getLifestyleAssessments,
  getLatestLifestyleAssessment,
} from "../controllers/lifestyleController.js";

const router = express.Router();

// Register the lifestyle assessment routes.
router.post("/", auth, createLifestyleAssessment);
router.get("/", auth, getLifestyleAssessments);
router.get("/latest", auth, getLatestLifestyleAssessment);

// Export the configured router.
export default router;
