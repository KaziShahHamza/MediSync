// ==========================================================
// Blood Request Constants
// ==========================================================

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// ==========================================================
// Request Lifetime
// ==========================================================

// Blood requests remain active for 24 hours.
export const REQUEST_LIFETIME_MS = 24 * 60 * 60 * 1000;

// ==========================================================
// Rate Limit
// ==========================================================

// Rate-limit window.
export const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;

// Maximum requests allowed from the same
// IP/device combination during the 24-hour window.
export const MAX_REQUESTS_PER_DAY = 3;

// ==========================================================
// Logged-in User Limit
// ==========================================================

// Maximum active blood requests owned
// by one authenticated user.
export const MAX_ACTIVE_REQUESTS_PER_USER = 3;

// ==========================================================
// Request Cooldown
// ==========================================================

// Minimum time between requests from the
// same IP/device combination.
export const REQUEST_COOLDOWN_MS = 5 * 60 * 1000;
