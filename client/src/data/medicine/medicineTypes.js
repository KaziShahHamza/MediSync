// client/src/data/medicine/medicineTypes.js

// Defines the supported medicine types and their display labels.

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
  MEDICINE_TYPES.map(({ value, label }) => [value, label])
);

export const STRIP_MEDICINE_TYPES = ["tablet", "capsule"];

export const isStripMedicineType = (type) =>
  STRIP_MEDICINE_TYPES.includes(type);