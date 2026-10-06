// client/src/utils/blood/bloodRequestHelpers.js

// Provides blood request constants, form defaults, and relative time/expiration formatting.
// Keeps shared request presentation and default values separate from components.

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const OTHER_HOSPITAL = "__other__";

export const EMPTY_BLOOD_REQUEST_FORM = {
  bloodGroup: "",
  bagsNeeded: "1",
  neededWithinDays: "",
  compensationOffered: "",
  district: "",
  upazila: "",
  hospitalName: "",
  hospitalAddress: "",
  contactPhone: "",
  requesterName: "",
  notes: "",
};

export function formatTimeAgo(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  return "Recently";
}

export function formatExpiry(dateString) {
  const expiresAt = new Date(dateString);

  if (Number.isNaN(expiresAt.getTime())) {
    return "Expired";
  }

  const diff = expiresAt.getTime() - Date.now();

  if (diff <= 0) {
    return "Expired";
  }

  const minutes = Math.ceil(diff / 60000);

  if (minutes < 60) {
    return `Expires in ${minutes} min`;
  }

  const hours = Math.ceil(minutes / 60);

  if (hours < 24) {
    return `Expires in ${hours} hr`;
  }

  const days = Math.ceil(hours / 24);

  return `Expires in ${days} day${days !== 1 ? "s" : ""}`;
}
