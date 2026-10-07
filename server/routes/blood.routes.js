// server/routes/blood.routes.js

// Defines API endpoints for blood request management and donor searches.
// Maps Express route pathways to corresponding blood controller functions.

import express from "express";

import {
  createBloodRequest,
  getBloodRequests,
} from "../controllers/blood/bloodRequestController.js";

import {
  authorizeBloodRequestManagement,
  getDonors,
  updateBloodRequest,
  deleteBloodRequest,
} from "../controllers/blood/bloodRequestManagementController.js";
import validate from "../middlewares/validate.js";
import { bloodRequestSchema } from "../validators/bloodRequest.schema.js";

const router = express.Router();

// Route to search and fetch available blood donors
router.get("/donors", getDonors);

// Route to create a new blood donation request
router.post("/requests", validate(bloodRequestSchema), createBloodRequest);

// Route to fetch all active blood donation requests
router.get("/requests", getBloodRequests);

// Route to verify a public blood request management token
router.post("/requests/:id/authorize", authorizeBloodRequestManagement);

// Route to update an existing blood request by ID
router.put("/requests/:id", validate(bloodRequestSchema), updateBloodRequest);

// Route to delete a blood request by ID
router.delete("/requests/:id", deleteBloodRequest);

export default router;
