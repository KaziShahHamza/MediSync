// server/routes/doctor.routes.js

// Defines authenticated routes for doctor management.

import express from "express";

import auth from "../middlewares/auth.js";

import {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";

const router = express.Router();

// Retrieve all doctors for the authenticated user.
router.get("/", auth, getDoctors);

// Create a new doctor for the authenticated user.
router.post("/", auth, createDoctor);

// Update an existing doctor owned by the authenticated user.
router.put("/:id", auth, updateDoctor);

// Delete an existing doctor owned by the authenticated user.
router.delete("/:id", auth, deleteDoctor);

export default router;
