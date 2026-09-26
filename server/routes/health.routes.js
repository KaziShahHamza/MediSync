// server/routes/health.routes.js

// Defines authenticated health log endpoints.
// Delegates request handling to the health controller.

import express from "express";

import auth from "../middlewares/auth.js";
import {
  createHealthLog,
  getHealthLogs,
  deleteHealthLog,
} from "../controllers/healthController.js";

const router = express.Router();

// Register health log routes.
router.post("/", auth, createHealthLog);
router.get("/", auth, getHealthLogs);
router.delete("/:id", auth, deleteHealthLog);

// Export the configured router.
export default router;
