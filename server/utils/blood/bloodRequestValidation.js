// server/utils/blood/bloodRequestValidation.js

// Validates blood request payloads including blood groups, contact details,
// locations, expiration duration, and text field limits.

import { bloodRequestSchema } from "../../validators/bloodRequest.schema.js";
import { BLOOD_GROUPS, normalizeString } from "./bloodRequestHelpers.js";

// Checks whether a blood group belongs to the supported values.
export function isValidBloodGroup(value) {
  return BLOOD_GROUPS.includes(value);
}

// Checks whether a phone number matches the accepted format.
export function isValidPhone(value) {
  const phone = normalizeString(value);

  return /^[+]?[\d\s()-]{7,20}$/.test(phone);
}

// Preserves the legacy helper API while using the shared request schema.
export function validateBloodRequest(body = {}) {
  const result = bloodRequestSchema.safeParse(body);

  return result.success
    ? null
    : result.error.issues[0]?.message || "Invalid blood request data.";
}
