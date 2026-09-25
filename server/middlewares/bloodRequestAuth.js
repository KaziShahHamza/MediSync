// server/middlewares/bloodRequestAuth.js

// Authentication and authorization utilities for managing blood requests.
// Supports JWT token validation and guest token hash verification.

import crypto from "crypto";
import jwt from "jsonwebtoken";

import { normalizeString } from "../utils/blood/bloodRequestHelpers.js";

// Extract user ID from Bearer token if valid authorization header exists
export function getOptionalAuthenticatedUser(req) {
  const authHeader = req.headers.authorization;

  // Check for presence of Bearer scheme in auth header
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = authHeader.split(" ")[1];

    // Decode JWT token using environment secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return decoded.id || null;
  } catch {
    return null;
  }
}

// Verify if client is authorized via user account or management token
export function authorizeBloodRequest(req, request) {
  const authenticatedUserId = getOptionalAuthenticatedUser(req);

  // Validate ownership for logged-in users matching request owner ID
  if (
    authenticatedUserId &&
    request.user &&
    request.user.toString() === authenticatedUserId
  ) {
    return true;
  }

  const managementToken = normalizeString(req.body?.managementToken);

  // Validate management token hash for non-authenticated guests
  if (
    managementToken &&
    request.managementTokenHash &&
    hashManagementToken(managementToken) === request.managementTokenHash
  ) {
    return true;
  }

  return false;
}

// Generate SHA-256 hash for raw public management tokens
export function hashManagementToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
