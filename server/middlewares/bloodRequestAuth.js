// server/middlewares/bloodRequestAuth.js

// Provides authentication and authorization helpers for blood requests.
// Supports logged-in users and public management tokens.

import crypto from "crypto";
import jwt from "jsonwebtoken";

import { normalizeString } from "../utils/blood/bloodRequestHelpers.js";

// Resolves an authenticated user ID when a valid JWT is available.
export function getOptionalAuthenticatedUser(req) {
  const authHeader = req.headers.authorization;

  // Ignore requests without the expected bearer authentication scheme.
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return decoded.id || null;
  } catch {
    return null;
  }
}

// Checks ownership through either account authentication or management token.
export function authorizeBloodRequest(req, request) {
  const authenticatedUserId = getOptionalAuthenticatedUser(req);

  // Allow the request owner to manage their authenticated request.
  if (
    authenticatedUserId &&
    request.user &&
    request.user.toString() === authenticatedUserId
  ) {
    return true;
  }

  const managementToken = normalizeString(req.body?.managementToken);

  // Allow public management using the stored token hash.
  if (
    managementToken &&
    request.managementTokenHash &&
    hashManagementToken(managementToken) === request.managementTokenHash
  ) {
    return true;
  }

  return false;
}

// Hashes public management tokens before comparison or storage.
export function hashManagementToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
