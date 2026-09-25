// server/controllers/medicineController.js

// Handles HTTP requests and responses for medicine management.

import mongoose from "mongoose";

import {
  findMedicinesByUser,
  createMedicine,
  findMedicineById,
  saveMedicine,
  deleteMedicine,
} from "../services/medicineService.js";

import { validateMedicineDates } from "../utils/medicine/medicineHelpers.js";

import { validateMedicineData } from "../utils/medicine/medicineValidation.js";

// Returns all medicines owned by the authenticated user.
export async function getMedicines(req, res) {
  try {
    const medicines = await findMedicinesByUser(req.userId);

    return res.json(medicines);
  } catch (error) {
    console.error("Failed to fetch medicines:", error);

    return res.status(500).json({
      message: "Failed to fetch medicines.",
    });
  }
}

// Creates a new medicine after validating its data.
export async function createMedicineController(req, res) {
  try {
    const {
      name,
      type = "tablet",
      pricingType,
      dosage = [],

      pricePerStrip,
      piecesPerStrip,

      pricePerUnit,
      unitsPerMonth,

      imageUrl = "",

      startDate,
      endDate,
      isActive = true,
    } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Medicine name is required.",
      });
    }

    // Validate medicine date range.
    const dateValidation = validateMedicineDates({
      startDate,
      endDate,
      isActive,
    });

    if (!dateValidation.valid) {
      return res.status(400).json({
        message: dateValidation.error,
      });
    }

    // Validate pricing and dosage data.
    const medicineValidation = validateMedicineData({
      type,
      pricingType,
      dosage,

      pricePerStrip,
      piecesPerStrip,

      pricePerUnit,
      unitsPerMonth,
    });

    if (!medicineValidation.valid) {
      return res.status(400).json({
        message: medicineValidation.error,
      });
    }

    const medicine = await createMedicine({
      user: req.userId,

      name: name.trim(),

      type: medicineValidation.type,
      pricingType: medicineValidation.pricingType,

      dosage: medicineValidation.dosage,

      pricePerStrip: medicineValidation.pricePerStrip,

      piecesPerStrip: medicineValidation.piecesPerStrip,

      pricePerUnit: medicineValidation.pricePerUnit,

      unitsPerMonth: medicineValidation.unitsPerMonth,

      imageUrl: typeof imageUrl === "string" ? imageUrl.trim() : "",

      startDate: dateValidation.startDate,

      endDate: dateValidation.endDate,

      isActive: Boolean(isActive),
    });

    return res.status(201).json(medicine);
  } catch (error) {
    console.error("Failed to create medicine:", error);

    return res.status(500).json({
      message: "Failed to create medicine.",
    });
  }
}

// Updates an existing medicine owned by the user.
export async function updateMedicine(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid medicine ID.",
      });
    }

    const existingMedicine = await findMedicineById(id, req.userId);

    if (!existingMedicine) {
      return res.status(404).json({
        message: "Medicine not found.",
      });
    }

    const {
      name,
      type = existingMedicine.type,
      pricingType,
      dosage = [],

      pricePerStrip,
      piecesPerStrip,

      pricePerUnit,
      unitsPerMonth,

      imageUrl = "",

      startDate,
      endDate,
      isActive = true,
    } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Medicine name is required.",
      });
    }

    // Validate updated date range.
    const dateValidation = validateMedicineDates({
      startDate,
      endDate,
      isActive,
    });

    if (!dateValidation.valid) {
      return res.status(400).json({
        message: dateValidation.error,
      });
    }

    // Validate updated pricing and dosage.
    const medicineValidation = validateMedicineData({
      type,
      pricingType,
      dosage,

      pricePerStrip,
      piecesPerStrip,

      pricePerUnit,
      unitsPerMonth,
    });

    if (!medicineValidation.valid) {
      return res.status(400).json({
        message: medicineValidation.error,
      });
    }

    existingMedicine.name = name.trim();

    existingMedicine.type = medicineValidation.type;

    existingMedicine.pricingType = medicineValidation.pricingType;

    existingMedicine.dosage = medicineValidation.dosage;

    existingMedicine.pricePerStrip = medicineValidation.pricePerStrip;

    existingMedicine.piecesPerStrip = medicineValidation.piecesPerStrip;

    existingMedicine.pricePerUnit = medicineValidation.pricePerUnit;

    existingMedicine.unitsPerMonth = medicineValidation.unitsPerMonth;

    existingMedicine.imageUrl =
      typeof imageUrl === "string" ? imageUrl.trim() : "";

    existingMedicine.startDate = dateValidation.startDate;

    existingMedicine.endDate = dateValidation.endDate;

    existingMedicine.isActive = Boolean(isActive);

    // Persist the validated medicine.
    const medicine = await saveMedicine(existingMedicine);

    return res.json(medicine);
  } catch (error) {
    console.error("Failed to update medicine:", error);

    return res.status(500).json({
      message: "Failed to update medicine.",
    });
  }
}

// Deletes a medicine owned by the authenticated user.
export async function deleteMedicineController(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid medicine ID.",
      });
    }

    const medicine = await deleteMedicine(id, req.userId);

    if (!medicine) {
      return res.status(404).json({
        message: "Medicine not found.",
      });
    }

    return res.json({
      message: "Medicine deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete medicine:", error);

    return res.status(500).json({
      message: "Failed to delete medicine.",
    });
  }
}
