// server/routes/medicine.routes.js

// Defines authenticated routes for medicine CRUD operations.
// Delegates request handling to dedicated medicine controllers.

import express from "express";

import auth from "../middlewares/auth.js";

import {
  getMedicines,
  createMedicineController,
} from "../controllers/medicine/medicineController.js";

import {
  updateMedicine,
  deleteMedicineController,
} from "../controllers/medicine/medicineManagementController.js";

const router = express.Router();

// Fetches the authenticated user's medicines.
router.get("/", auth, getMedicines);

// Creates a new medicine for the authenticated user.
router.post("/", auth, createMedicineController);

// Updates an existing medicine owned by the authenticated user.
router.put("/:id", auth, updateMedicine);

// Deletes an existing medicine owned by the authenticated user.
router.delete("/:id", auth, deleteMedicineController);

export default router;
