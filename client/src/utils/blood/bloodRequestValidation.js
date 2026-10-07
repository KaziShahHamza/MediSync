// client/src/utils/blood/bloodRequestValidation.js

// Provides blood request normalization and immediate client validation.

import { BLOOD_GROUPS } from "./bloodRequestHelpers";

const PHONE_PATTERN = /^[+]?[\d\s()-]{7,20}$/;

function addError(errors, field, message) {
  if (!errors[field]) {
    errors[field] = message;
  }
}

function normalizeNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return value;
  }

  return typeof value === "number" ? value : Number(value);
}

function normalizeCompensation(value) {
  if (value === true || value === "yes") return true;
  if (value === false || value === "no") return false;

  return undefined;
}

export function validateBloodRequestForm(values) {
  const normalized = {
    bloodGroup: values?.bloodGroup?.trim() || "",
    bagsNeeded: normalizeNumber(values?.bagsNeeded),
    neededWithinDays: normalizeNumber(values?.neededWithinDays),
    compensationOffered: normalizeCompensation(values?.compensationOffered),
    district: values?.district?.trim() || "",
    upazila: values?.upazila?.trim() || "",
    hospitalName: values?.hospitalName?.trim() || "",
    hospitalAddress: values?.hospitalAddress?.trim() || "",
    contactPhone: values?.contactPhone?.trim() || "",
    requesterName: values?.requesterName?.trim() || "",
    notes: values?.notes?.trim() || "",
    deviceId: values?.deviceId?.trim().slice(0, 100) || "",
    managementToken: values?.managementToken?.trim() || "",
  };

  const errors = {};

  if (!BLOOD_GROUPS.includes(normalized.bloodGroup)) {
    addError(errors, "bloodGroup", "Please select a valid blood group.");
  }

  if (
    !Number.isInteger(normalized.bagsNeeded) ||
    normalized.bagsNeeded < 1 ||
    normalized.bagsNeeded > 20
  ) {
    addError(errors, "bagsNeeded", "Number of bags must be between 1 and 20.");
  }

  if (
    !Number.isInteger(normalized.neededWithinDays) ||
    normalized.neededWithinDays < 1 ||
    normalized.neededWithinDays > 7
  ) {
    addError(
      errors,
      "neededWithinDays",
      "Please select a valid timeframe between 1 and 7 days.",
    );
  }

  if (typeof normalized.compensationOffered !== "boolean") {
    addError(
      errors,
      "compensationOffered",
      "Please specify whether you will provide travel cost or honorarium.",
    );
  }

  if (!normalized.district)
    addError(errors, "district", "District is required.");
  if (normalized.district.length > 100) {
    addError(errors, "district", "District is too long.");
  }

  if (!normalized.upazila) addError(errors, "upazila", "Upazila is required.");
  if (normalized.upazila.length > 100) {
    addError(errors, "upazila", "Upazila is too long.");
  }

  if (!normalized.hospitalName) {
    addError(errors, "hospitalName", "Hospital name is required.");
  } else if (normalized.hospitalName.length > 200) {
    addError(errors, "hospitalName", "Hospital name is too long.");
  }

  if (!normalized.hospitalAddress) {
    addError(errors, "hospitalAddress", "Hospital address is required.");
  } else if (normalized.hospitalAddress.length > 500) {
    addError(errors, "hospitalAddress", "Hospital address is too long.");
  }

  if (!normalized.contactPhone) {
    addError(errors, "contactPhone", "Contact phone is required.");
  } else if (
    normalized.contactPhone.length > 30 ||
    !PHONE_PATTERN.test(normalized.contactPhone)
  ) {
    addError(
      errors,
      "contactPhone",
      "Please provide a valid contact phone number.",
    );
  }

  if (normalized.requesterName.length > 50) {
    addError(errors, "requesterName", "Requester name is too long.");
  }

  if (normalized.notes.length > 1000) {
    addError(errors, "notes", "Notes are too long.");
  }

  if (normalized.deviceId.length > 100) {
    addError(errors, "deviceId", "Invalid device identifier.");
  }

  if (normalized.managementToken.length > 256) {
    addError(errors, "managementToken", "Invalid management token.");
  }

  return { values: normalized, errors };
}
