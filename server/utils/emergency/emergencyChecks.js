// server/utils/emergency/emergencyChecks.js

// Evaluates health readings against configured emergency thresholds.

import {
  CRITICAL_SYSTOLIC,
  CRITICAL_DIASTOLIC,
  CRITICAL_LOW_GLUCOSE,
  CRITICAL_HIGH_GLUCOSE,
} from "./emergencyConstants.js";

// Checks whether blood pressure exceeds a critical threshold.
export function checkBloodPressure(high, low) {
  const systolic = Number(high);
  const diastolic = Number(low);

  // Ignore readings that are not valid numeric values.
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

// Checks whether blood glucose reaches a critical low or high threshold.
export function checkBloodSugar(glucose, glucoseTiming) {
  const value = Number(glucose);

  // Ignore glucose readings that are not valid numeric values.
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
