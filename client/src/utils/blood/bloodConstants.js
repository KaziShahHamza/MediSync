// client/src/utils/blood/bloodConstants.js

// Defines shared blood request constants and the initial request form state.
// Keeps blood-related static values centralized for reuse across components.

export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

export const OTHER_HOSPITAL = "__other__";

export const EMPTY_BLOOD_REQUEST_FORM = {
  bloodGroup: "",
  bagsNeeded: "1",
  compensationOffered: "",
  district: "",
  upazila: "",
  hospitalName: "",
  hospitalAddress: "",
  contactPhone: "",
  requesterName: "",
  notes: "",
};