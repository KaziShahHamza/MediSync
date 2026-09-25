// server/utils/bloodRequestConstants.js

// Global configuration constants for blood request module.
// Defines allowed groups, rate limits, and time windows.

// List of supported blood group types
export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Total active lifetime of a blood request (24 hours)
export const REQUEST_LIFETIME_MS = 24 * 60 * 60 * 1000;

// Time window for client rate limiting (24 hours)
export const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;

// Maximum allowed submissions per IP/device per window
export const MAX_REQUESTS_PER_DAY = 3;

// Maximum active requests per registered user
export const MAX_ACTIVE_REQUESTS_PER_USER = 3;

// Minimum cooldown duration between consecutive requests
export const REQUEST_COOLDOWN_MS = 5 * 60 * 1000;
