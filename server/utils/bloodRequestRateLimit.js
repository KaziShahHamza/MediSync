import crypto from "crypto";

import BloodRequestRateLimit from "../models/BloodRequestRateLimit.js";

import {
  RATE_LIMIT_WINDOW_MS,
  MAX_REQUESTS_PER_DAY,
} from "./bloodRequestConstants.js";

// ==========================================================
// Rate Limit Key
// ==========================================================

function createRateLimitKey({ ipHash, deviceId }) {
  return crypto
    .createHash("sha256")
    .update(`${ipHash}:${deviceId || "no-device"}:${process.env.JWT_SECRET}`)
    .digest("hex");
}

// ==========================================================
// Check + Update Rate Limit
// ==========================================================

export async function checkAndUpdateRateLimit({ ipHash, deviceId }) {
  const now = new Date();

  const key = createRateLimitKey({
    ipHash,
    deviceId,
  });

  let rateLimit = await BloodRequestRateLimit.findOne({
    key,
  });

  // --------------------------------------------------------
  // No existing window
  // --------------------------------------------------------

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

  // --------------------------------------------------------
  // Limit reached
  // --------------------------------------------------------

  if (rateLimit.count >= MAX_REQUESTS_PER_DAY) {
    return {
      allowed: false,
      rateLimit,
    };
  }

  // --------------------------------------------------------
  // Increment counter
  // --------------------------------------------------------

  rateLimit.count += 1;

  await rateLimit.save();

  return {
    allowed: true,
    rateLimit,
  };
}
