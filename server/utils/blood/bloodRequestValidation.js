// server/utils/blood/bloodRequestValidation.js

// Validates blood request payloads including blood groups, contact details,
// locations, expiration duration, and text field limits.

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

// Validates all fields required to create or update a blood request.
export function validateBloodRequest(body = {}) {
  const bloodGroup = normalizeString(body.bloodGroup);

  const bagsNeeded = Number(body.bagsNeeded);

  const neededWithinDays = Number(body.neededWithinDays);

  const district = normalizeString(body.district);

  const upazila = normalizeString(body.upazila);

  const hospitalName = normalizeString(body.hospitalName);

  const hospitalAddress = normalizeString(body.hospitalAddress);

  const contactPhone = normalizeString(body.contactPhone);

  const requesterName = normalizeString(body.requesterName);

  const notes = normalizeString(body.notes);

  const compensationOffered = body.compensationOffered;

  // Validate the selected blood group.
  if (!isValidBloodGroup(bloodGroup)) {
    return "Please select a valid blood group.";
  }

  // Validate the requested number of blood bags.
  if (!Number.isInteger(bagsNeeded) || bagsNeeded < 1 || bagsNeeded > 20) {
    return "Number of bags must be between 1 and 20.";
  }

  // Validate how long the request should remain active.
  if (
    !Number.isInteger(neededWithinDays) ||
    neededWithinDays < 1 ||
    neededWithinDays > 7
  ) {
    return "Please select a valid timeframe between 1 and 7 days.";
  }

  // Validate the required location fields.
  if (!district) {
    return "District is required.";
  }

  if (!upazila) {
    return "Upazila is required.";
  }

  // Validate required hospital information.
  if (!hospitalName) {
    return "Hospital name is required.";
  }

  if (!hospitalAddress) {
    return "Hospital address is required.";
  }

  // Validate contact information.
  if (!isValidPhone(contactPhone)) {
    return "Please provide a valid contact phone number.";
  }

  // Compensation must explicitly be true or false.
  if (typeof compensationOffered !== "boolean") {
    return "Please specify whether you will provide travel cost or honorarium.";
  }

  // Enforce text length limits.
  if (requesterName.length > 100) {
    return "Requester name is too long.";
  }

  if (notes.length > 1000) {
    return "Notes are too long.";
  }

  return null;
}
