// server/utils/medicine/medicineHelpers.js

// Provides reusable helpers for medicine pricing classification and date validation.

import { STRIP_MEDICINE_TYPES } from "./medicineConstants.js";

// Determines whether a medicine uses strip or unit pricing.
export function getPricingTypeForMedicine(type) {
  return STRIP_MEDICINE_TYPES.includes(type) ? "strip" : "unit";
}

// Converts a date-like value into a valid Date object or null.
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

// Validates treatment start and end dates according to medicine status.
export function validateMedicineDates({ startDate, endDate, isActive }) {
  const normalizedStartDate = normalizeDate(startDate);

  // Require a valid treatment start date.
  if (!normalizedStartDate) {
    return {
      valid: false,
      error: "A valid start date is required.",
    };
  }

  // Completed medicines require a valid chronological end date.
  if (!isActive) {
    const normalizedEndDate = normalizeDate(endDate);

    if (!normalizedEndDate) {
      return {
        valid: false,
        error: "A valid end date is required for a past medicine.",
      };
    }

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

  return {
    valid: true,
    startDate: normalizedStartDate,
    endDate: null,
  };
}
