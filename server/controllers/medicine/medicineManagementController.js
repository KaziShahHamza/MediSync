// server/controllers/medicine/medicineManagementController.js

// Handles HTTP requests for updating and deleting medicines.
// Ensures requested medicines belong to the authenticated user before modification.

import mongoose from "mongoose";

import {
  findMedicineById,
  saveMedicine,
  deleteMedicine,
} from "../../services/medicineService.js";

import { validateMedicineDates } from "../../utils/medicine/medicineHelpers.js";

import { validateMedicineData } from "../../utils/medicine/medicineValidation.js";

// Updates an existing medicine owned by the authenticated user.
export async function updateMedicine(req, res) {
  try {
    const { id } = req.params;

    // Validate the medicine identifier before querying MongoDB.
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
      pricingType = existingMedicine.pricingType,
      dosage = existingMedicine.dosage,
      pricePerStrip = existingMedicine.pricePerStrip,
      piecesPerStrip = existingMedicine.piecesPerStrip,
      pricePerUnit = existingMedicine.pricePerUnit,
      unitsPerMonth = existingMedicine.unitsPerMonth,
      imageUrl = existingMedicine.imageUrl,
      startDate = existingMedicine.startDate,
      endDate = existingMedicine.endDate,
      isActive = existingMedicine.isActive,
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

    // Validate the complete treatment date state after applying existing values.
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

    // Validate and normalize the complete pricing and dosage state.
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
      typeof imageUrl === "string"
        ? imageUrl.trim()
        : existingMedicine.imageUrl;

    existingMedicine.startDate = dateValidation.startDate;

    existingMedicine.endDate = dateValidation.endDate;

    existingMedicine.isActive = isActive;

    // Persist the validated medicine document.
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

    // Validate the medicine identifier before querying MongoDB.
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
