// server/utils/blood/bloodRequestHelpers.js

// Provides reusable helpers for blood request normalization, hashing, and public data mapping.

import crypto from "crypto";

import { REQUEST_LIFETIME_MS } from "./bloodRequestConstants.js";

// Creates a salted hash for sensitive string values.
export function hashValue(value) {
  return crypto
    .createHash("sha256")
    .update(`${value}:${process.env.JWT_SECRET}`)
    .digest("hex");
}

// Generates a secure management token for guest requests.
export function generateManagementToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Hashes a guest management token before storage or comparison.
export function hashManagementToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// Extracts the originating client IP from the request.
export function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return req.socket?.remoteAddress || req.ip || "unknown";
}

// Normalizes string input for consistent request processing.
export function normalizeString(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

// Calculates the expiration timestamp for a blood request.
export function getRequestExpiry() {
  return new Date(Date.now() + REQUEST_LIFETIME_MS);
}

// Maps a request document to its safe public representation.
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
