// server/routes/medicine.routes.js

// Defines authenticated routes for medicine CRUD operations.

import express from "express";

import auth from "../middlewares/auth.js";

import {
  getMedicines,
  createMedicineController,
  updateMedicine,
  deleteMedicineController,
} from "../controllers/medicineController.js";

const router = express.Router();

// Fetch the authenticated user's medicines.
router.get("/", auth, getMedicines);

// Create a new medicine.
router.post("/", auth, createMedicineController);

// Update an existing medicine.
router.put("/:id", auth, updateMedicine);

// Delete an existing medicine.
router.delete("/:id", auth, deleteMedicineController);

export default router;
