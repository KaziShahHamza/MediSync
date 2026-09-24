import crypto from "crypto";
import jwt from "jsonwebtoken";

import { normalizeString } from "../utils/bloodRequestHelpers.js";

// ==========================================================
// Optional Authentication
// ==========================================================

/**
 * Reads an optional Bearer token.
 *
 * Returns:
 * - user ID when token is valid
 * - null when token is missing/invalid
 *
 * Public users are allowed to continue.
 */
export function getOptionalAuthenticatedUser(req) {
  const authHeader = req.headers.authorization;

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

// ==========================================================
// Blood Request Authorization
// ==========================================================

/**
 * Authorizes a blood request owner.
 *
 * Supports:
 *
 * 1. Logged-in owner:
 *    Authorization: Bearer <token>
 *
 * 2. Public owner:
 *    managementToken in request body
 */
export function authorizeBloodRequest(req, request) {
  const authenticatedUserId = getOptionalAuthenticatedUser(req);

  // --------------------------------------------------------
  // Logged-in owner
  // --------------------------------------------------------

  if (
    authenticatedUserId &&
    request.user &&
    request.user.toString() === authenticatedUserId
  ) {
    return true;
  }

  // --------------------------------------------------------
  // Public management token
  // --------------------------------------------------------

  const managementToken = normalizeString(req.body?.managementToken);

  if (
    managementToken &&
    request.managementTokenHash &&
    hashManagementToken(managementToken) === request.managementTokenHash
  ) {
    return true;
  }

  return false;
}

// ==========================================================
// Management Token Hash
// ==========================================================

export function hashManagementToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
