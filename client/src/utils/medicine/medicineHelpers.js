// client/src/utils/medicine/medicineHelpers.js

// Provides reusable medicine formatting, date, dosage, and type helpers.
// Keeps medicine display and normalization logic centralized.

import {
  MEDICINE_TYPE_LABELS,
  isStripMedicineType,
} from "../../data/medicine/medicineTypes";

import {
  DOSAGE_TIME_LABELS,
  DOSAGE_TIME_VALUES,
} from "../../data/medicine/dosageOptions";

import { MONTH_LABELS } from "../../data/medicine/medicineMonths";

// Resolves a human-readable label for a medicine type.
export function getMedicineTypeLabel(type) {
  return MEDICINE_TYPE_LABELS[type] || type || "Other";
}

// Formats a date using the US short date format.
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

// Formats a date using the UK day-month-year format.
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

// Resolves a human-readable label for a dosage timing value.
export function formatDosageTime(time) {
  if (!time) return "";

  return (
    DOSAGE_TIME_LABELS[time] || time.charAt(0).toUpperCase() + time.slice(1)
  );
}

// Extracts zero-based month and full year values from a date.
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

// Creates a date using a zero-based month and full year.
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

// Creates a readable month-and-year preview from selected values.
export function formatDateForPreview(month, year) {
  const date = createDateFromParts(month, year);

  if (!date) return "";

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

// Generates consecutive year options around the current year.
export function getYearOptions(range = 10) {
  const currentYear = new Date().getFullYear();

  return Array.from(
    { length: range * 2 + 1 },
    (_, index) => currentYear - range + index,
  );
}

// Normalizes dosage entries to supported times and positive quantities.
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

// Resolves pricing mode from a medicine type.
export function getPricingTypeForType(type) {
  return isStripMedicineType(type) ? "strip" : "unit";
}

// Checks whether a medicine type uses strip-based pricing.
export function isStripMedicine(medicine) {
  if (!medicine) return false;

  return getPricingTypeForType(medicine.type) === "strip";
}

// Determines whether a medicine treatment is active or completed.
export function getTreatmentStatus(medicine) {
  return medicine?.isActive !== false ? "active" : "completed";
}

// Returns the user-facing treatment status label.
export function getTreatmentStatusLabel(medicine) {
  return getTreatmentStatus(medicine) === "active"
    ? "Currently taking"
    : "Completed";
}

// Resolves a full month name from a zero-based month index.
export function getMonthLabel(month) {
  if (month === "" || month === null || month === undefined) {
    return "";
  }

  return MONTH_LABELS[Number(month)] || "";
}
