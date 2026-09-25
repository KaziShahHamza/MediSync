// server/routes/blood.routes.js

// Defines API endpoints for blood request management and donor searches.
// Maps Express route pathways to corresponding blood controller functions.

import express from "express";

import {
  createBloodRequest,
  getBloodRequests,
} from "../controllers/blood/bloodRequestController.js";

import {
  getDonors,
  updateBloodRequest,
  deleteBloodRequest,
} from "../controllers/blood/bloodRequestManagementController.js";

const router = express.Router();

// Route to search and fetch available blood donors
router.get("/donors", getDonors);

// Route to create a new blood donation request
router.post("/requests", createBloodRequest);

// Route to fetch all active blood donation requests
router.get("/requests", getBloodRequests);

// Route to update an existing blood request by ID
router.put("/requests/:id", updateBloodRequest);

// Route to delete a blood request by ID
router.delete("/requests/:id", deleteBloodRequest);

export default router;
