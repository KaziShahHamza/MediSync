// server/utils/medicine/medicineConstants.js

// Defines supported medicine types, pricing groups, and dosage times.

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

// Constants are shared by validation and medicine helpers.
export const DEFAULT_MEDICINE_TYPE = "tablet";
