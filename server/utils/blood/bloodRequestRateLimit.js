// server/utils/blood/bloodRequestRateLimit.js

// Provides database-backed rate limiting for blood request submissions.

import crypto from "crypto";

import BloodRequestRateLimit from "../../models/BloodRequestRateLimit.js";

import {
  RATE_LIMIT_WINDOW_MS,
  MAX_REQUESTS_PER_DAY,
} from "./bloodRequestHelpers.js";

// Creates a private rate-limit key from client identifiers.
function createRateLimitKey({ ipHash, deviceId }) {
  return crypto
    .createHash("sha256")
    .update(`${ipHash}:${deviceId || "no-device"}:${process.env.JWT_SECRET}`)
    .digest("hex");
}

// Checks the active request window and updates its submission count.
export async function checkAndUpdateRateLimit({ ipHash, deviceId }) {
  const now = new Date();

  const key = createRateLimitKey({
    ipHash,
    deviceId,
  });

  let rateLimit = await BloodRequestRateLimit.findOne({
    key,
  });

  // Start a fresh rate-limit window when no active record exists.
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

  // Reject submissions after the configured daily threshold.
  if (rateLimit.count >= MAX_REQUESTS_PER_DAY) {
    return {
      allowed: false,
      rateLimit,
    };
  }

  // Increment the active window submission counter.
  rateLimit.count += 1;

  await rateLimit.save();

  return {
    allowed: true,
    rateLimit,
  };
}
