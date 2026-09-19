// server/routes/medicine.routes.js

import express from "express";
import mongoose from "mongoose";

import Medicine from "../models/Medicine.js";
import auth from "../middleware/auth.js";

const router = express.Router();

const MEDICINE_TYPES = [
  "tablet",
  "capsule",
  "syrup",
  "antibiotic",
  "injection",
  "cream",
  "ointment",
  "drops",
  "inhaler",
  "other",
];

const STRIP_MEDICINE_TYPES = ["tablet", "capsule"];

const DOSAGE_TIMES = [
  "morning",
  "noon",
  "night",
];

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

function getPricingTypeForMedicine(type) {
  return STRIP_MEDICINE_TYPES.includes(type)
    ? "strip"
    : "unit";
}

function normalizeDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function validateMedicineDates({
  startDate,
  endDate,
  isActive,
}) {
  const normalizedStartDate =
    normalizeDate(startDate);

  if (!normalizedStartDate) {
    return {
      valid: false,
      error: "A valid start date is required.",
    };
  }

  if (!isActive) {
    const normalizedEndDate =
      normalizeDate(endDate);

    if (!normalizedEndDate) {
      return {
        valid: false,
        error:
          "A valid end date is required for a past medicine.",
      };
    }

    if (
      normalizedEndDate <
      normalizedStartDate
    ) {
      return {
        valid: false,
        error:
          "End date cannot be earlier than the start date.",
      };
    }

    return {
      valid: true,
      startDate: normalizedStartDate,
      endDate: normalizedEndDate,
    };
  }

  return {
    valid: true,
    startDate: normalizedStartDate,
    endDate: null,
  };
}

/*
 * ============================================================
 * MEDICINE DATA VALIDATION
 * ============================================================
 */

function validateMedicineData({
  type,
  pricingType,
  dosage,
  pricePerStrip,
  piecesPerStrip,
  pricePerUnit,
  unitsPerMonth,
}) {
  /*
   * ----------------------------------------------------------
   * Medicine type
   * ----------------------------------------------------------
   */

  if (!MEDICINE_TYPES.includes(type)) {
    return {
      valid: false,
      error: "Invalid medicine type.",
    };
  }

  /*
   * ----------------------------------------------------------
   * Determine expected pricing type
   * ----------------------------------------------------------
   */

  const expectedPricingType =
    getPricingTypeForMedicine(type);

  if (
    pricingType !== expectedPricingType
  ) {
    return {
      valid: false,
      error:
        "Invalid pricing type for the selected medicine type.",
    };
  }

  /*
   * ==========================================================
   * STRIP MEDICINE
   * ==========================================================
   */

  if (pricingType === "strip") {
    /*
     * Dosage is required for strip medicines.
     */

    if (!Array.isArray(dosage)) {
      return {
        valid: false,
        error:
          "Dosage schedule must be an array.",
      };
    }

    if (dosage.length === 0) {
      return {
        valid: false,
        error:
          "Please select at least one dosage time.",
      };
    }

    const normalizedDosage = [];

    for (const item of dosage) {
      if (!item || typeof item !== "object") {
        return {
          valid: false,
          error: "Invalid dosage entry.",
        };
      }

      if (
        !DOSAGE_TIMES.includes(item.time)
      ) {
        return {
          valid: false,
          error:
            "Invalid dosage time.",
        };
      }

      const quantity = Number(
        item.quantity,
      );

      if (
        !Number.isFinite(quantity) ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return {
          valid: false,
          error:
            "Each dosage quantity must be a positive integer.",
        };
      }

      normalizedDosage.push({
        time: item.time,
        quantity,
      });
    }

    /*
     * Strip price
     */

    const normalizedPricePerStrip =
      Number(pricePerStrip);

    if (
      !Number.isFinite(
        normalizedPricePerStrip,
      ) ||
      normalizedPricePerStrip <= 0
    ) {
      return {
        valid: false,
        error:
          "Please enter a valid price per strip/পাতা.",
      };
    }

    /*
     * Pieces per strip
     */

    const normalizedPiecesPerStrip =
      Number(piecesPerStrip);

    if (
      !Number.isFinite(
        normalizedPiecesPerStrip,
      ) ||
      !Number.isInteger(
        normalizedPiecesPerStrip,
      ) ||
      normalizedPiecesPerStrip < 1
    ) {
      return {
        valid: false,
        error:
          "Pieces per strip/পাতা must be a positive integer.",
      };
    }

    return {
      valid: true,

      type,
      pricingType: "strip",

      dosage: normalizedDosage,

      pricePerStrip:
        normalizedPricePerStrip,

      piecesPerStrip:
        normalizedPiecesPerStrip,

      /*
       * Unit pricing is not applicable.
       */

      pricePerUnit: null,
      unitsPerMonth: null,
    };
  }

  /*
   * ==========================================================
   * UNIT MEDICINE
   * ==========================================================
   */

  /*
   * Unit medicines must not have dosage pricing data.
   */

  if (
    Array.isArray(dosage) &&
    dosage.length > 0
  ) {
    return {
      valid: false,
      error:
        "Unit medicines cannot have a dosage schedule for pricing.",
    };
  }

  /*
   * Price per unit
   */

  const normalizedPricePerUnit =
    Number(pricePerUnit);

  if (
    !Number.isFinite(
      normalizedPricePerUnit,
    ) ||
    normalizedPricePerUnit <= 0
  ) {
    return {
      valid: false,
      error:
        "Please enter a valid price per unit.",
    };
  }

  /*
   * Units needed per month
   */

  const normalizedUnitsPerMonth =
    Number(unitsPerMonth);

  if (
    !Number.isFinite(
      normalizedUnitsPerMonth,
    ) ||
    !Number.isInteger(
      normalizedUnitsPerMonth,
    ) ||
    normalizedUnitsPerMonth < 1
  ) {
    return {
      valid: false,
      error:
        "Units needed per month must be a positive integer.",
    };
  }

  return {
    valid: true,

    type,
    pricingType: "unit",

    /*
     * Unit medicines do not use dosage
     * for pricing.
     */

    dosage: [],

    /*
     * Strip pricing is not applicable.
     */

    pricePerStrip: null,
    piecesPerStrip: null,

    pricePerUnit:
      normalizedPricePerUnit,

    unitsPerMonth:
      normalizedUnitsPerMonth,
  };
}

/*
 * ============================================================
 * GET ALL MEDICINES
 * ============================================================
 */

router.get(
  "/",
  auth,
  async (req, res) => {
    try {
      const medicines =
        await Medicine.find({
          user: req.userId,
        }).sort({
          isActive: -1,
          startDate: -1,
        });

      res.json(medicines);
    } catch (error) {
      console.error(
        "Failed to fetch medicines:",
        error,
      );

      res.status(500).json({
        message:
          "Failed to fetch medicines.",
      });
    }
  },
);

/*
 * ============================================================
 * CREATE MEDICINE
 * ============================================================
 */

router.post(
  "/",
  auth,
  async (req, res) => {
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

      /*
       * --------------------------------------------------------
       * Name
       * --------------------------------------------------------
       */

      if (
        typeof name !== "string" ||
        !name.trim()
      ) {
        return res.status(400).json({
          message:
            "Medicine name is required.",
        });
      }

      /*
       * --------------------------------------------------------
       * Dates
       * --------------------------------------------------------
       */

      const dateValidation =
        validateMedicineDates({
          startDate,
          endDate,
          isActive,
        });

      if (!dateValidation.valid) {
        return res.status(400).json({
          message: dateValidation.error,
        });
      }

      /*
       * --------------------------------------------------------
       * Medicine data
       * --------------------------------------------------------
       */

      const medicineValidation =
        validateMedicineData({
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
          message:
            medicineValidation.error,
        });
      }

      /*
       * --------------------------------------------------------
       * Create
       * --------------------------------------------------------
       */

      const medicine =
        await Medicine.create({
          user: req.userId,

          name: name.trim(),

          type: medicineValidation.type,
          pricingType:
            medicineValidation.pricingType,

          dosage:
            medicineValidation.dosage,

          pricePerStrip:
            medicineValidation.pricePerStrip,

          piecesPerStrip:
            medicineValidation.piecesPerStrip,

          pricePerUnit:
            medicineValidation.pricePerUnit,

          unitsPerMonth:
            medicineValidation.unitsPerMonth,

          imageUrl:
            typeof imageUrl === "string"
              ? imageUrl.trim()
              : "",

          startDate:
            dateValidation.startDate,

          endDate:
            dateValidation.endDate,

          isActive: Boolean(isActive),
        });

      res.status(201).json(medicine);
    } catch (error) {
      console.error(
        "Failed to create medicine:",
        error,
      );

      res.status(500).json({
        message:
          "Failed to create medicine.",
      });
    }
  },
);

/*
 * ============================================================
 * UPDATE MEDICINE
 * ============================================================
 */

router.put(
  "/:id",
  auth,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          message:
            "Invalid medicine ID.",
        });
      }

      const existingMedicine =
        await Medicine.findOne({
          _id: id,
          user: req.userId,
        });

      if (!existingMedicine) {
        return res.status(404).json({
          message:
            "Medicine not found.",
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

      /*
       * --------------------------------------------------------
       * Name
       * --------------------------------------------------------
       */

      if (
        typeof name !== "string" ||
        !name.trim()
      ) {
        return res.status(400).json({
          message:
            "Medicine name is required.",
        });
      }

      /*
       * --------------------------------------------------------
       * Dates
       * --------------------------------------------------------
       */

      const dateValidation =
        validateMedicineDates({
          startDate,
          endDate,
          isActive,
        });

      if (!dateValidation.valid) {
        return res.status(400).json({
          message: dateValidation.error,
        });
      }

      /*
       * --------------------------------------------------------
       * Medicine data
       * --------------------------------------------------------
       */

      const medicineValidation =
        validateMedicineData({
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
          message:
            medicineValidation.error,
        });
      }

      /*
       * --------------------------------------------------------
       * Update
       * --------------------------------------------------------
       */

      existingMedicine.name =
        name.trim();

      existingMedicine.type =
        medicineValidation.type;

      existingMedicine.pricingType =
        medicineValidation.pricingType;

      existingMedicine.dosage =
        medicineValidation.dosage;

      existingMedicine.pricePerStrip =
        medicineValidation.pricePerStrip;

      existingMedicine.piecesPerStrip =
        medicineValidation.piecesPerStrip;

      existingMedicine.pricePerUnit =
        medicineValidation.pricePerUnit;

      existingMedicine.unitsPerMonth =
        medicineValidation.unitsPerMonth;

      existingMedicine.imageUrl =
        typeof imageUrl === "string"
          ? imageUrl.trim()
          : "";

      existingMedicine.startDate =
        dateValidation.startDate;

      existingMedicine.endDate =
        dateValidation.endDate;

      existingMedicine.isActive =
        Boolean(isActive);

      await existingMedicine.save();

      res.json(existingMedicine);
    } catch (error) {
      console.error(
        "Failed to update medicine:",
        error,
      );

      res.status(500).json({
        message:
          "Failed to update medicine.",
      });
    }
  },
);

/*
 * ============================================================
 * DELETE MEDICINE
 * ============================================================
 */

router.delete(
  "/:id",
  auth,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          message:
            "Invalid medicine ID.",
        });
      }

      const medicine =
        await Medicine.findOneAndDelete({
          _id: id,
          user: req.userId,
        });

      if (!medicine) {
        return res.status(404).json({
          message:
            "Medicine not found.",
        });
      }

      res.json({
        message:
          "Medicine deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Failed to delete medicine:",
        error,
      );

      res.status(500).json({
        message:
          "Failed to delete medicine.",
      });
    }
  },
);

export default router;