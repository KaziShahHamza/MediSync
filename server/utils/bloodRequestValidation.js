import { BLOOD_GROUPS } from "./bloodRequestConstants.js";

import { normalizeString } from "./bloodRequestHelpers.js";

// ==========================================================
// Blood Group Validation
// ==========================================================

export function isValidBloodGroup(value) {
  return BLOOD_GROUPS.includes(value);
}

// ==========================================================
// Phone Validation
// ==========================================================

export function isValidPhone(value) {
  const phone = normalizeString(value);

  // Bangladesh-oriented basic validation.
  //
  // Allows:
  // +880...
  // 01...
  // spaces
  // hyphens
  // parentheses
  //
  // This is intentionally basic rather than
  // enforcing one specific mobile format.
  return /^[+]?[\d\s()-]{7,20}$/.test(phone);
}

// ==========================================================
// Blood Request Validation
// ==========================================================

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

  // --------------------------------------------------------
  // Blood group
  // --------------------------------------------------------

  if (!isValidBloodGroup(bloodGroup)) {
    return "Please select a valid blood group.";
  }

  // --------------------------------------------------------
  // Bags needed
  // --------------------------------------------------------

  if (!Number.isInteger(bagsNeeded) || bagsNeeded < 1 || bagsNeeded > 20) {
    return "Number of bags must be between 1 and 20.";
  }

  // --------------------------------------------------------
  // Location
  // --------------------------------------------------------

  if (!district) {
    return "District is required.";
  }

  if (!upazila) {
    return "Upazila is required.";
  }

  // --------------------------------------------------------
  // Hospital
  // --------------------------------------------------------

  if (!hospitalName) {
    return "Hospital name is required.";
  }

  if (!hospitalAddress) {
    return "Hospital address is required.";
  }

  // --------------------------------------------------------
  // Contact
  // --------------------------------------------------------

  if (!isValidPhone(contactPhone)) {
    return "Please provide a valid contact phone number.";
  }

  // --------------------------------------------------------
  // Compensation
  // --------------------------------------------------------

  if (typeof compensationOffered !== "boolean") {
    return "Please specify whether you will provide travel cost or honorarium.";
  }

  // --------------------------------------------------------
  // Optional fields
  // --------------------------------------------------------

  if (requesterName.length > 100) {
    return "Requester name is too long.";
  }

  if (notes.length > 1000) {
    return "Notes are too long.";
  }

  return null;
}
