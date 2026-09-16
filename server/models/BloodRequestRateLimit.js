import mongoose from "mongoose";

const bloodRequestRateLimitSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      // index: true,
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

// Remove rate-limit records after their 24-hour window.
bloodRequestRateLimitSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 },
);

export default mongoose.model(
  "BloodRequestRateLimit",
  bloodRequestRateLimitSchema,
);