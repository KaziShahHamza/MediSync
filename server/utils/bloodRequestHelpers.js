import crypto from "crypto";

import { REQUEST_LIFETIME_MS } from "./bloodRequestConstants.js";

// ==========================================================
// Generic Hash
// ==========================================================

export function hashValue(value) {
  return crypto
    .createHash("sha256")
    .update(`${value}:${process.env.JWT_SECRET}`)
    .digest("hex");
}

// ==========================================================
// Management Token
// ==========================================================

export function generateManagementToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashManagementToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// ==========================================================
// Client IP
// ==========================================================

export function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return req.socket?.remoteAddress || req.ip || "unknown";
}

// ==========================================================
// String Normalization
// ==========================================================

export function normalizeString(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

// ==========================================================
// Request Expiry
// ==========================================================

export function getRequestExpiry() {
  return new Date(Date.now() + REQUEST_LIFETIME_MS);
}

// ==========================================================
// Public Blood Request Data
// ==========================================================

export function publicRequestData(request) {
  return {
    id: request._id,

    bloodGroup: request.bloodGroup,

    bagsNeeded: request.bagsNeeded,

    compensationOffered: request.compensationOffered,

    district: request.location?.district || "",

    upazila: request.location?.upazila || "",

    hospital: {
      name: request.hospital?.name || "",

      address: request.hospital?.address || "",
    },

    contactPhone: request.contactPhone || "",

    requesterName: request.requesterName || "",

    notes: request.notes || "",

    createdAt: request.createdAt,

    expiresAt: request.expiresAt,
  };
}
