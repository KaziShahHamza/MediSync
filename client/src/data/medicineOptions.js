// client/src/data/medicineOptions.js

// Defines reusable medicine types, dosage times, treatment months, and related lookup values.
// Keeps medicine form options centralized in one data module.

export const DOSAGE_OPTIONS = [
  { value: "morning", label: "Morning" },
  { value: "noon", label: "Noon" },
  { value: "night", label: "Night" },
];

export const DOSAGE_TIME_LABELS = Object.fromEntries(
  DOSAGE_OPTIONS.map(({ value, label }) => [value, label]),
);

export const DOSAGE_TIME_VALUES = DOSAGE_OPTIONS.map(({ value }) => value);

export const MEDICINE_MONTHS = [
  { value: 0, label: "January" },
  { value: 1, label: "February" },
  { value: 2, label: "March" },
  { value: 3, label: "April" },
  { value: 4, label: "May" },
  { value: 5, label: "June" },
  { value: 6, label: "July" },
  { value: 7, label: "August" },
  { value: 8, label: "September" },
  { value: 9, label: "October" },
  { value: 10, label: "November" },
  { value: 11, label: "December" },
];

export const MONTH_LABELS = Object.fromEntries(
  MEDICINE_MONTHS.map(({ value, label }) => [value, label]),
);

export const MEDICINE_TYPES = [
  { value: "tablet", label: "Tablet" },
  { value: "capsule", label: "Capsule" },
  { value: "syrup", label: "Syrup" },
  { value: "antibiotic", label: "Antibiotic" },
  { value: "injection", label: "Injection" },
  { value: "cream", label: "Cream" },
  { value: "ointment", label: "Ointment" },
  { value: "drops", label: "Drops" },
  { value: "inhaler", label: "Inhaler" },
  { value: "other", label: "Other" },
];

export const MEDICINE_TYPE_LABELS = Object.fromEntries(
  MEDICINE_TYPES.map(({ value, label }) => [value, label]),
);

export const STRIP_MEDICINE_TYPES = ["tablet", "capsule"];

export const isStripMedicineType = (type) =>
  STRIP_MEDICINE_TYPES.includes(type);
