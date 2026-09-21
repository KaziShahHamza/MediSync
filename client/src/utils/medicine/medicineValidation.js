// client/src/utils/medicine/medicineValidation.js

// Validates medicine form data before it is submitted to the backend.

import { DOSAGE_TIME_VALUES } from "../../data/medicine/dosageOptions";

import { isStripMedicineType } from "../../data/medicine/medicineTypes";

// Checks whether a value is a valid positive number.
function isPositiveNumber(value) {
  return Number.isFinite(Number(value)) && Number(value) > 0;
}

// Checks whether a value is a valid positive integer.
function isPositiveInteger(value) {
  return Number.isInteger(Number(value)) && Number(value) > 0;
}

// Determines if a value is non-empty and defined.
function hasValue(value) {
  return value !== "" && value !== null && value !== undefined;
}

// Validates medicine name presence.
export function validateMedicineName(name) {
  if (!name || !name.trim()) {
    return "Medicine name is required.";
  }

  return null;
}

// Validates medicine category selection.
export function validateMedicineType(type) {
  if (!type) {
    return "Medicine type is required.";
  }

  return null;
}

// Validates array of daily dosage timing and quantity entries.
export function validateDosage(dosage) {
  if (!Array.isArray(dosage) || dosage.length === 0) {
    return "Select at least one dosage time.";
  }

  for (const item of dosage) {
    if (!item || !DOSAGE_TIME_VALUES.includes(item.time)) {
      return "Invalid dosage time.";
    }

    if (!isPositiveInteger(item.quantity)) {
      return "Dosage quantity must be a positive integer.";
    }
  }

  return null;
}

// Validates strip pricing inputs.
export function validateStripPricing({ pricePerStrip, piecesPerStrip }) {
  if (!isPositiveNumber(pricePerStrip)) {
    return "Price per strip must be greater than 0.";
  }

  if (!isPositiveInteger(piecesPerStrip)) {
    return "Pieces per strip must be a positive integer.";
  }

  return null;
}

// Validates unit pricing inputs.
export function validateUnitPricing({ pricePerUnit, unitsPerMonth }) {
  if (!isPositiveNumber(pricePerUnit)) {
    return "Price per unit must be greater than 0.";
  }

  if (!isPositiveInteger(unitsPerMonth)) {
    return "Units per month must be a positive integer.";
  }

  return null;
}

// Validates treatment start date inputs.
export function validateStartDate({ startMonth, startYear }) {
  if (!hasValue(startMonth) || !hasValue(startYear)) {
    return "Treatment start month and year are required.";
  }

  return null;
}

// Validates treatment end date and ensures chronological consistency.
export function validateEndDate({
  startMonth,
  startYear,
  endMonth,
  endYear,
  isActive,
}) {
  if (isActive) {
    return null;
  }

  if (!hasValue(endMonth) || !hasValue(endYear)) {
    return "Treatment end month and year are required.";
  }

  // Construct start date for chronological comparison.
  const startDate = new Date(Number(startYear), Number(startMonth), 1);

  // Construct end date for chronological comparison.
  const endDate = new Date(Number(endYear), Number(endMonth), 1);

  if (endDate < startDate) {
    return "Treatment end date cannot be before the start date.";
  }

  return null;
}

// Coordinates complete validation pass across all medicine form fields.
export function validateMedicineForm({
  name,
  type,
  dosage,
  pricePerStrip,
  piecesPerStrip,
  pricePerUnit,
  unitsPerMonth,
  startMonth,
  startYear,
  endMonth,
  endYear,
  isActive,
}) {
  // Validate name.
  const nameError = validateMedicineName(name);

  if (nameError) return nameError;

  // Validate type.
  const typeError = validateMedicineType(type);

  if (typeError) return typeError;

  // Validate pricing and dosage based on pricing type.
  if (isStripMedicineType(type)) {
    const dosageError = validateDosage(dosage);

    if (dosageError) return dosageError;

    const pricingError = validateStripPricing({
      pricePerStrip,
      piecesPerStrip,
    });

    if (pricingError) return pricingError;
  } else {
    const pricingError = validateUnitPricing({
      pricePerUnit,
      unitsPerMonth,
    });

    if (pricingError) return pricingError;
  }

  // Validate treatment start date.
  const startDateError = validateStartDate({
    startMonth,
    startYear,
  });

  if (startDateError) return startDateError;

  // Validate treatment end date.
  const endDateError = validateEndDate({
    startMonth,
    startYear,
    endMonth,
    endYear,
    isActive,
  });

  if (endDateError) return endDateError;

  return null;
}
