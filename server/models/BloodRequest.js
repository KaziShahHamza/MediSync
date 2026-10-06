// server/models/BloodRequest.js

// Defines blood request data, ownership, contact details, and expiration.
// Stores private anti-spam and management information separately.

import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
      trim: true,
    },

    bagsNeeded: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },

    neededWithinDays: {
      type: Number,
      required: true,
      min: 1,
      max: 7,
    },

    compensationOffered: {
      type: Boolean,
      required: true,
    },

    location: {
      district: {
        type: String,
        required: true,
        trim: true,
      },

      upazila: {
        type: String,
        required: true,
        trim: true,
      },
    },

    hospital: {
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
      },

      address: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
      },
    },

    contactPhone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },

    requesterName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    // Only guests receive a management token.
    // Authenticated users are authorized through their account.
    managementTokenHash: {
      type: String,
      default: null,
      select: false,
    },

    // Private anti-spam information.
    requesterIpHash: {
      type: String,
      default: "",
      select: false,
    },

    deviceId: {
      type: String,
      default: "",
      select: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    // Used by MongoDB TTL to automatically remove expired requests.
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Automatically removes expired blood requests.
bloodRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("BloodRequest", bloodRequestSchema);
