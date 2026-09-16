import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema(
  {
    // Optional.
    // Logged-in users are associated with their account.
    // Public users leave this empty.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    bloodGroup: {
      type: String,
      enum: [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ],
      required: true,
      trim: true,
    },

    bagsNeeded: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },

    // Whether the requester is willing to provide
    // honorarium / travel / commute cost.
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

    // Optional public-facing requester name.
    requesterName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    // Optional additional information.
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    // Only public users need this.
    // We never return the hash publicly.
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

    // Private browser/device identifier.
    deviceId: {
      type: String,
      default: "",
      select: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      required: true,
      // index: true,
    },
  },
  {
    timestamps: true,
  },
);

// MongoDB automatically removes the document after expiresAt.
bloodRequestSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 },
);

export default mongoose.model(
  "BloodRequest",
  bloodRequestSchema,
);