// server/utils/medicine/medicineValidation.js

// Validates and normalizes medicine type, pricing, dosage schedules, and quantities.
// Keeps medicine input rules centralized for both create and update operations.

import {
  MEDICINE_TYPES,
  DOSAGE_TIMES,
  getPricingTypeForMedicine,
} from "./medicineHelpers.js";

// Validates and normalizes medicine pricing and dosage data.
export function validateMedicineData({
  type,
  pricingType,
  dosage,
  pricePerStrip,
  piecesPerStrip,
  pricePerUnit,
  unitsPerMonth,
}) {
  // Validate the selected medicine type.
  if (!MEDICINE_TYPES.includes(type)) {
    return {
      valid: false,
      error: "Invalid medicine type.",
    };
  }

  const expectedPricingType = getPricingTypeForMedicine(type);

  // Ensure the pricing type matches the selected medicine type.
  if (pricingType !== expectedPricingType) {
    return {
      valid: false,
      error: "Invalid pricing type for the selected medicine type.",
    };
  }

  // Validate strip-based medicine dosage and pricing.
  if (pricingType === "strip") {
    if (!Array.isArray(dosage)) {
      return {
        valid: false,
        error: "Dosage schedule must be an array.",
      };
    }

    if (dosage.length === 0) {
      return {
        valid: false,
        error: "Please select at least one dosage time.",
      };
    }

    const normalizedDosage = [];
    const dosageTimes = new Set();

    for (const item of dosage) {
      // Reject malformed dosage entries.
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return {
          valid: false,
          error: "Invalid dosage entry.",
        };
      }

      // Validate the dosage time.
      if (!DOSAGE_TIMES.includes(item.time)) {
        return {
          valid: false,
          error: "Invalid dosage time.",
        };
      }

      // Prevent duplicate dosage times in the same schedule.
      if (dosageTimes.has(item.time)) {
        return {
          valid: false,
          error: "Each dosage time can only be selected once.",
        };
      }

      dosageTimes.add(item.time);

      const quantity = Number(item.quantity);

      // Require each dosage quantity to be a positive integer.
      if (
        !Number.isFinite(quantity) ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return {
          valid: false,
          error: "Each dosage quantity must be a positive integer.",
        };
      }

      normalizedDosage.push({
        time: item.time,
        quantity,
      });
    }

    // Validate the price of one medicine strip.
    const normalizedPricePerStrip = Number(pricePerStrip);

    if (
      !Number.isFinite(normalizedPricePerStrip) ||
      normalizedPricePerStrip <= 0
    ) {
      return {
        valid: false,
        error: "Please enter a valid price per strip.",
      };
    }

    // Validate the number of pieces contained in one strip.
    const normalizedPiecesPerStrip = Number(piecesPerStrip);

    if (
      !Number.isFinite(normalizedPiecesPerStrip) ||
      !Number.isInteger(normalizedPiecesPerStrip) ||
      normalizedPiecesPerStrip < 1
    ) {
      return {
        valid: false,
        error: "Pieces per strip must be a positive integer.",
      };
    }

    return {
      valid: true,
      type,
      pricingType: "strip",
      dosage: normalizedDosage,
      pricePerStrip: normalizedPricePerStrip,
      piecesPerStrip: normalizedPiecesPerStrip,
      pricePerUnit: null,
      unitsPerMonth: null,
    };
  }

  // Unit-priced medicines should not contain a dosage schedule.
  if (Array.isArray(dosage) && dosage.length > 0) {
    return {
      valid: false,
      error: "Unit medicines cannot have a dosage schedule for pricing.",
    };
  }

  // Reject malformed dosage values for unit medicines.
  if (dosage !== undefined && !Array.isArray(dosage)) {
    return {
      valid: false,
      error: "Dosage schedule must be an array.",
    };
  }

  // Validate the price of one unit.
  const normalizedPricePerUnit = Number(pricePerUnit);

  if (!Number.isFinite(normalizedPricePerUnit) || normalizedPricePerUnit <= 0) {
    return {
      valid: false,
      error: "Please enter a valid price per unit.",
    };
  }

  // Validate the required monthly unit quantity.
  const normalizedUnitsPerMonth = Number(unitsPerMonth);

  if (
    !Number.isFinite(normalizedUnitsPerMonth) ||
    !Number.isInteger(normalizedUnitsPerMonth) ||
    normalizedUnitsPerMonth < 1
  ) {
    return {
      valid: false,
      error: "Units needed per month must be a positive integer.",
    };
  }

  return {
    valid: true,
    type,
    pricingType: "unit",
    dosage: [],
    pricePerStrip: null,
    piecesPerStrip: null,
    pricePerUnit: normalizedPricePerUnit,
    unitsPerMonth: normalizedUnitsPerMonth,
  };
}
