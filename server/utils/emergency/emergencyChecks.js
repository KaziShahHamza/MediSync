// server/utils/emergency/emergencyChecks.js

// Evaluates blood pressure and glucose readings against configured critical thresholds.
// Rejects invalid values before creating an emergency trigger.

const CRITICAL_SYSTOLIC = 180;
const CRITICAL_DIASTOLIC = 120;

const CRITICAL_LOW_GLUCOSE = 3.0;
const CRITICAL_HIGH_GLUCOSE = 22.2;

const VALID_GLUCOSE_TIMINGS = new Set(["fasting", "random", "postMeal"]);

// Checks whether blood pressure reaches or exceeds a critical threshold.
export function checkBloodPressure(high, low) {
  const systolic = Number(high);
  const diastolic = Number(low);

  // Ignore missing, non-numeric, or non-positive blood pressure values.
  if (
    !Number.isFinite(systolic) ||
    !Number.isFinite(diastolic) ||
    systolic <= 0 ||
    diastolic <= 0
  ) {
    return null;
  }

  if (systolic >= CRITICAL_SYSTOLIC || diastolic >= CRITICAL_DIASTOLIC) {
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

  // Ignore missing, non-numeric, or negative glucose values.
  if (!Number.isFinite(value) || value < 0) {
    return null;
  }

  // Ignore unsupported glucose measurement types.
  if (!VALID_GLUCOSE_TIMINGS.has(glucoseTiming)) {
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
