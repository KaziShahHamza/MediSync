import express from "express";

// import { getDonors } from "../controllers/bloodDonorController.js";

import {
  createBloodRequest,
  getBloodRequests,
} from "../controllers/bloodRequestController.js";

import {
  getDonors,
  updateBloodRequest,
  deleteBloodRequest,
} from "../controllers/bloodRequestManagementController.js";

const router = express.Router();

// ==========================================================
// Public Donor Discovery
// ==========================================================

router.get("/donors", getDonors);

// ==========================================================
// Blood Requests
// ==========================================================

// Create a blood request.
// Authentication is optional.
router.post("/requests", createBloodRequest);

// Get active blood requests.
router.get("/requests", getBloodRequests);

// Update a blood request.
router.put("/requests/:id", updateBloodRequest);

// Delete a blood request.
router.delete("/requests/:id", deleteBloodRequest);

export default router;
