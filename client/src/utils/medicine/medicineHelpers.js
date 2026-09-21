// client/src/utils/medicine/medicineHelpers.js

// Provides reusable formatting, date, dosage, and medicine-type helpers.

import {
  MEDICINE_TYPE_LABELS,
  isStripMedicineType,
} from "../../data/medicine/medicineTypes";

import {
  DOSAGE_TIME_LABELS,
  DOSAGE_TIME_VALUES,
} from "../../data/medicine/dosageOptions";

import { MONTH_LABELS } from "../../data/medicine/medicineMonths";

// Resolves human-readable display label for a given medicine type.
export function getMedicineTypeLabel(type) {
  return MEDICINE_TYPE_LABELS[type] || type || "Other";
}

// Formats date string into US standard format (e.g., Jan 1, 2026).
export function formatDate(date, fallback = "—") {
  if (!date) return fallback;

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return fallback;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Formats date string into long UK standard format (e.g., 01 Jan 2026).
export function formatDateLong(date, fallback = "Not set") {
  if (!date) return fallback;

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return fallback;
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Capitalizes and formats dosage timing keys into display labels.
export function formatDosageTime(time) {
  if (!time) return "";

  return (
    DOSAGE_TIME_LABELS[time] || time.charAt(0).toUpperCase() + time.slice(1)
  );
}

// Extracts zero-indexed month and full year from a date object or string.
export function getDateParts(dateValue) {
  if (!dateValue) {
    return {
      month: "",
      year: "",
    };
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return {
      month: "",
      year: "",
    };
  }

  return {
    month: date.getMonth(),
    year: date.getFullYear(),
  };
}

// Constructs a Date object set to the 1st of the specified month and year.
export function createDateFromParts(month, year) {
  if (
    month === "" ||
    month === null ||
    month === undefined ||
    year === "" ||
    year === null ||
    year === undefined
  ) {
    return null;
  }

  const parsedMonth = Number(month);
  const parsedYear = Number(year);

  if (
    !Number.isInteger(parsedMonth) ||
    !Number.isInteger(parsedYear) ||
    parsedMonth < 0 ||
    parsedMonth > 11
  ) {
    return null;
  }

  return new Date(parsedYear, parsedMonth, 1);
}

// Generates month and year preview string from discrete month and year inputs.
export function formatDateForPreview(month, year) {
  const date = createDateFromParts(month, year);

  if (!date) return "";

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

// Generates array of consecutive year values around the current year.
export function getYearOptions(range = 10) {
  const currentYear = new Date().getFullYear();

  return Array.from(
    { length: range * 2 + 1 },
    (_, index) => currentYear - range + index,
  );
}

// Sanitizes and structures dosage items to ensure valid timings and positive quantities.
export function normalizeDosage(dosage = []) {
  if (!Array.isArray(dosage)) {
    return [];
  }

  return dosage
    .filter((item) => item && DOSAGE_TIME_VALUES.includes(item.time))
    .map((item) => ({
      time: item.time,
      quantity:
        Number.isFinite(Number(item.quantity)) && Number(item.quantity) > 0
          ? Number(item.quantity)
          : 1,
    }));
}

// Determines whether medicine is priced per strip or per unit based on category.
export function getPricingTypeForType(type) {
  return isStripMedicineType(type) ? "strip" : "unit";
}

// Checks if medicine uses strip-based pricing logic.
export function isStripMedicine(medicine) {
  if (!medicine) return false;

  return getPricingTypeForType(medicine.type) === "strip";
}

// Determines treatment state based on active flag.
export function getTreatmentStatus(medicine) {
  return medicine?.isActive !== false ? "active" : "completed";
}

// Returns user-facing status string for treatment progress.
export function getTreatmentStatusLabel(medicine) {
  return getTreatmentStatus(medicine) === "active"
    ? "Currently taking"
    : "Completed";
}

// Converts zero-indexed month index into full month name string.
export function getMonthLabel(month) {
  if (month === "" || month === null || month === undefined) {
    return "";
  }

  return MONTH_LABELS[Number(month)] || "";
}
