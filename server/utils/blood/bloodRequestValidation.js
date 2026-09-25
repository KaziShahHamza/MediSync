// server/utils/blood/bloodRequestValidation.js

// Input validation functions for blood request creation payloads.
// Validates fields including blood group, phone format, and locations.

import { BLOOD_GROUPS } from "./bloodRequestConstants.js";

import { normalizeString } from "./bloodRequestHelpers.js";

// Check if string matches allowed blood group list
export function isValidBloodGroup(value) {
  return BLOOD_GROUPS.includes(value);
}

// Validate contact phone number string structure
export function isValidPhone(value) {
  const phone = normalizeString(value);

  return /^[+]?[\d\s()-]{7,20}$/.test(phone);
}

// Perform full validation check on incoming request body data
export function validateBloodRequest(body) {
  const bloodGroup = normalizeString(body.bloodGroup);

  const bagsNeeded = Number(body.bagsNeeded);

  const district = normalizeString(body.district);

  const upazila = normalizeString(body.upazila);

  const hospitalName = normalizeString(body.hospitalName);

  const hospitalAddress = normalizeString(body.hospitalAddress);

  const contactPhone = normalizeString(body.contactPhone);

  const requesterName = normalizeString(body.requesterName);

  const notes = normalizeString(body.notes);

  const compensationOffered = body.compensationOffered;

  // Validate blood group selection
  if (!isValidBloodGroup(bloodGroup)) {
    return "Please select a valid blood group.";
  }

  // Validate number of bags required
  if (!Number.isInteger(bagsNeeded) || bagsNeeded < 1 || bagsNeeded > 20) {
    return "Number of bags must be between 1 and 20.";
  }

  // Ensure mandatory location fields are present
  if (!district) {
    return "District is required.";
  }

  if (!upazila) {
    return "Upazila is required.";
  }

  // Ensure mandatory hospital details are present
  if (!hospitalName) {
    return "Hospital name is required.";
  }

  if (!hospitalAddress) {
    return "Hospital address is required.";
  }

  // Validate contact telephone format
  if (!isValidPhone(contactPhone)) {
    return "Please provide a valid contact phone number.";
  }

  // Verify compensation option is specified as boolean
  if (typeof compensationOffered !== "boolean") {
    return "Please specify whether you will provide travel cost or honorarium.";
  }

  // Verify length constraints on text fields
  if (requesterName.length > 100) {
    return "Requester name is too long.";
  }

  if (notes.length > 1000) {
    return "Notes are too long.";
  }

  return null;
}
