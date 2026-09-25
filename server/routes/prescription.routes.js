// server/routes/prescription.routes.js

// Defines authenticated routes for prescription management.
import express from "express";

import auth from "../middlewares/auth.js";

import {
  getPrescriptions,
  createPrescription,
  analyzePrescription,
  deletePrescription,
} from "../controllers/prescriptionController.js";

const router = express.Router();

// Register prescription collection routes.
router.get("/", auth, getPrescriptions);
router.post("/", auth, createPrescription);

// Register prescription analysis and deletion routes.
router.post("/:id/analyze", auth, analyzePrescription);
router.delete("/:id", auth, deletePrescription);

export default router;
