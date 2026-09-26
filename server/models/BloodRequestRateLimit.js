// server/models/BloodRequestRateLimit.js

// Defines temporary rate-limit records for blood request submissions.
// Automatically removes records after their expiration window.

import mongoose from "mongoose";

const bloodRequestRateLimitSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },

    count: {
      type: Number,
      required: true,
      default: 0,
    },

    windowStart: {
      type: Date,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Automatically removes expired rate-limit records.
bloodRequestRateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model(
  "BloodRequestRateLimit",
  bloodRequestRateLimitSchema,
);
