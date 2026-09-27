// server/utils/medicine/medicineHelpers.js

// Provides shared medicine types, dosage options, pricing classification, and date validation.
// Keeps reusable medicine rules outside controllers and database services.

export const MEDICINE_TYPES = [
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

export const STRIP_MEDICINE_TYPES = ["tablet", "capsule"];

export const DOSAGE_TIMES = ["morning", "noon", "night"];

export const DEFAULT_MEDICINE_TYPE = "tablet";

// Determines whether a medicine uses strip or unit pricing.
export function getPricingTypeForMedicine(type) {
  return STRIP_MEDICINE_TYPES.includes(type) ? "strip" : "unit";
}

// Converts a supported date-like value into a valid Date object or null.
export function normalizeDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

// Validates treatment dates according to the medicine's active status.
export function validateMedicineDates({ startDate, endDate, isActive }) {
  const normalizedStartDate = normalizeDate(startDate);

  // Require a valid treatment start date.
  if (!normalizedStartDate) {
    return {
      valid: false,
      error: "A valid start date is required.",
    };
  }

  // Require a boolean status before applying active or completed date rules.
  if (typeof isActive !== "boolean") {
    return {
      valid: false,
      error: "Medicine active status must be a boolean.",
    };
  }

  // Active medicines do not require an end date.
  if (isActive) {
    return {
      valid: true,
      startDate: normalizedStartDate,
      endDate: null,
    };
  }

  const normalizedEndDate = normalizeDate(endDate);

  // Completed medicines require a valid end date.
  if (!normalizedEndDate) {
    return {
      valid: false,
      error: "A valid end date is required for a past medicine.",
    };
  }

  // Prevent completed medicines from ending before treatment begins.
  if (normalizedEndDate < normalizedStartDate) {
    return {
      valid: false,
      error: "End date cannot be earlier than the start date.",
    };
  }

  return {
    valid: true,
    startDate: normalizedStartDate,
    endDate: normalizedEndDate,
  };
}
