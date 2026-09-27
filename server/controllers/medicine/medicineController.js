// server/controllers/medicine/medicineController.js

// Handles HTTP requests for creating and retrieving medicines.
// Delegates database operations and validation to reusable services and utilities.

import {
  findMedicinesByUser,
  createMedicine,
} from "../../services/medicineService.js";

import { validateMedicineDates } from "../../utils/medicine/medicineHelpers.js";

import { validateMedicineData } from "../../utils/medicine/medicineValidation.js";

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

    // Require a non-empty medicine name.
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Medicine name is required.",
      });
    }

    // Require the active status to be an actual boolean value.
    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "Medicine active status must be a boolean.",
      });
    }

    // Validate the medicine treatment dates.
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

    // Validate and normalize medicine pricing and dosage data.
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

    // Normalize the optional image URL before saving.
    const normalizedImageUrl =
      typeof imageUrl === "string" ? imageUrl.trim() : "";

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
      imageUrl: normalizedImageUrl,
      startDate: dateValidation.startDate,
      endDate: dateValidation.endDate,
      isActive,
    });

    return res.status(201).json(medicine);
  } catch (error) {
    console.error("Failed to create medicine:", error);

    return res.status(500).json({
      message: "Failed to create medicine.",
    });
  }
}
