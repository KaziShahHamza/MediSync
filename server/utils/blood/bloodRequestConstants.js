// server/utils/bloodRequestConstants.js

// Global configuration constants for blood request module.
// Defines allowed groups, rate limits, and time windows.

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const REQUEST_LIFETIME_MS = 24 * 60 * 60 * 1000;

export const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;

export const MAX_REQUESTS_PER_DAY = 3;

export const MAX_ACTIVE_REQUESTS_PER_USER = 3;

export const REQUEST_COOLDOWN_MS = 5 * 60 * 1000;
