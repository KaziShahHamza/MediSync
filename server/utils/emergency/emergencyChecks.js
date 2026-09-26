// server/utils/emergency/emergencyChecks.js

// Evaluates blood pressure and glucose readings.
// Returns emergency trigger data when a critical threshold is reached.

import {
  CRITICAL_SYSTOLIC,
  CRITICAL_DIASTOLIC,
  CRITICAL_LOW_GLUCOSE,
  CRITICAL_HIGH_GLUCOSE,
} from "./emergencyConstants.js";

// Determines whether a blood pressure reading is critical.
export function checkBloodPressure(high, low) {
  const systolic = Number(high);
  const diastolic = Number(low);

  // Ignore readings that cannot be converted to valid numbers.
  if (!Number.isFinite(systolic) || !Number.isFinite(diastolic)) {
    return null;
  }

  if (systolic > CRITICAL_SYSTOLIC || diastolic > CRITICAL_DIASTOLIC) {
    return {
      type: "bloodPressure",
      triggerData: {
        high: systolic,
        low: diastolic,
      },
    };
  }

  return null;
}

// Determines whether a blood glucose reading is critical.
export function checkBloodSugar(glucose, glucoseTiming) {
  const value = Number(glucose);

  // Ignore readings that cannot be converted to valid numbers.
  if (!Number.isFinite(value)) {
    return null;
  }

  if (value < CRITICAL_LOW_GLUCOSE) {
    return {
      type: "bloodSugar",
      triggerData: {
        glucose: value,
        glucoseTiming,
        direction: "low",
      },
    };
  }

  if (value >= CRITICAL_HIGH_GLUCOSE) {
    return {
      type: "bloodSugar",
      triggerData: {
        glucose: value,
        glucoseTiming,
        direction: "high",
      },
    };
  }

  return null;
}
