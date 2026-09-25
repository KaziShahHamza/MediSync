// server/utils/blood/bloodRequestRateLimit.js

// Rate limiting module for blood request creations.
// Tracks request frequency per IP/device pair in database.

import crypto from "crypto";

import BloodRequestRateLimit from "../../models/BloodRequestRateLimit.js";

import {
  RATE_LIMIT_WINDOW_MS,
  MAX_REQUESTS_PER_DAY,
} from "./bloodRequestConstants.js";

// Generate unique hash key for IP and device combination
function createRateLimitKey({ ipHash, deviceId }) {
  return crypto
    .createHash("sha256")
    .update(`${ipHash}:${deviceId || "no-device"}:${process.env.JWT_SECRET}`)
    .digest("hex");
}

// Evaluate and update submission count for a given client
export async function checkAndUpdateRateLimit({ ipHash, deviceId }) {
  const now = new Date();

  const key = createRateLimitKey({
    ipHash,
    deviceId,
  });

  let rateLimit = await BloodRequestRateLimit.findOne({
    key,
  });

  // Create or reset rate limit tracking window if missing/expired
  if (!rateLimit || rateLimit.expiresAt <= now) {
    rateLimit = await BloodRequestRateLimit.findOneAndUpdate(
      { key },
      {
        $set: {
          count: 1,

          windowStart: now,

          expiresAt: new Date(now.getTime() + RATE_LIMIT_WINDOW_MS),
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    return {
      allowed: true,
      rateLimit,
    };
  }

  // Deny request if daily creation threshold reached
  if (rateLimit.count >= MAX_REQUESTS_PER_DAY) {
    return {
      allowed: false,
      rateLimit,
    };
  }

  // Increment submission counter for active window
  rateLimit.count += 1;

  await rateLimit.save();

  return {
    allowed: true,
    rateLimit,
  };
}
