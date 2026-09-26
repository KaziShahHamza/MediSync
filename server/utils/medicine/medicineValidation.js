// server/utils/medicine/medicineValidation.js

// Validates medicine type, pricing, dosage schedules, and normalized quantities.

import { MEDICINE_TYPES, DOSAGE_TIMES } from "./medicineConstants.js";

import { getPricingTypeForMedicine } from "./medicineHelpers.js";

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

  // Ensure pricing matches the selected medicine type.
  if (pricingType !== expectedPricingType) {
    return {
      valid: false,
      error: "Invalid pricing type for the selected medicine type.",
    };
  }

  // Validate dosage and strip-specific pricing.
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

    for (const item of dosage) {
      if (!item || typeof item !== "object") {
        return {
          valid: false,
          error: "Invalid dosage entry.",
        };
      }

      if (!DOSAGE_TIMES.includes(item.time)) {
        return {
          valid: false,
          error: "Invalid dosage time.",
        };
      }

      const quantity = Number(item.quantity);

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

    // Validate the strip price.
    const normalizedPricePerStrip = Number(pricePerStrip);

    if (
      !Number.isFinite(normalizedPricePerStrip) ||
      normalizedPricePerStrip <= 0
    ) {
      return {
        valid: false,
        error: "Please enter a valid price per strip/পাতা.",
      };
    }

    // Validate the number of pieces contained in each strip.
    const normalizedPiecesPerStrip = Number(piecesPerStrip);

    if (
      !Number.isFinite(normalizedPiecesPerStrip) ||
      !Number.isInteger(normalizedPiecesPerStrip) ||
      normalizedPiecesPerStrip < 1
    ) {
      return {
        valid: false,
        error: "Pieces per strip/পাতা must be a positive integer.",
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

  // Unit medicines must not contain dosage schedules.
  if (Array.isArray(dosage) && dosage.length > 0) {
    return {
      valid: false,
      error: "Unit medicines cannot have a dosage schedule for pricing.",
    };
  }

  // Validate the unit price.
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
