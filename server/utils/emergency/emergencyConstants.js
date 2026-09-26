// server/utils/emergency/emergencyConstants.js

// Stores emergency thresholds used by health alert evaluation.
// Keeps threshold values separate from emergency business logic.

const CRITICAL_SYSTOLIC = 180;
const CRITICAL_DIASTOLIC = 120;

const CRITICAL_LOW_GLUCOSE = 3.0;
const CRITICAL_HIGH_GLUCOSE = 22.2;

// Export emergency threshold constants.
export {
  CRITICAL_SYSTOLIC,
  CRITICAL_DIASTOLIC,
  CRITICAL_LOW_GLUCOSE,
  CRITICAL_HIGH_GLUCOSE,
};
