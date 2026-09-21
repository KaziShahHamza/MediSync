// client/src/data/medicine/dosageOptions.js

// Defines available medicine dosage times and their display labels.

export const DOSAGE_OPTIONS = [
  { value: "morning", label: "Morning" },
  { value: "noon", label: "Noon" },
  { value: "night", label: "Night" },
];

export const DOSAGE_TIME_LABELS = Object.fromEntries(
  DOSAGE_OPTIONS.map(({ value, label }) => [value, label])
);

export const DOSAGE_TIME_VALUES = DOSAGE_OPTIONS.map(
  ({ value }) => value
);