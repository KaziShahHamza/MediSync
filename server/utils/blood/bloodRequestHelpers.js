// server/utils/blood/bloodRequestHelpers.js

// Utility functions for string sanitization, token generation,
// IP extraction, and mapping public request payloads.

import crypto from "crypto";

import { REQUEST_LIFETIME_MS } from "./bloodRequestConstants.js";

// Compute salted SHA-256 hash for arbitrary string value
export function hashValue(value) {
  return crypto
    .createHash("sha256")
    .update(`${value}:${process.env.JWT_SECRET}`)
    .digest("hex");
}

// Generate random hex token for non-authenticated request owners
export function generateManagementToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Compute SHA-256 hash for guest management token
export function hashManagementToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// Extract origin IP address from request headers or socket connection
export function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return req.socket?.remoteAddress || req.ip || "unknown";
}

// Sanitize string value by stripping whitespace
export function normalizeString(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

// Calculate timestamp when a new request will expire
export function getRequestExpiry() {
  return new Date(Date.now() + REQUEST_LIFETIME_MS);
}

// Transform request document into sanitized public object
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
