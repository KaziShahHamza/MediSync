// server/models/Doctor.js

import mongoose from "mongoose";

const chamberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    serialNumber: {
      type: String,
      default: "",
      trim: true,
    },

    visitingDays: {
      type: [String],
      default: [],
    },

    visitingTime: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: true },
);

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Basic information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    bmdcRegNo: {
      type: String,
      default: "",
      trim: true,
    },

    // Professional qualifications
    degrees: {
      type: [String],
      default: [],
    },

    specialities: {
      type: [String],
      default: [],
    },

    designation: {
      type: String,
      default: "",
      trim: true,
    },

    primaryHospital: {
      type: String,
      default: "",
      trim: true,
    },

    // Chamber information
    chambers: {
      type: [chamberSchema],
      default: [],
    },

    // Contact information
    contactInfo: {
      phones: {
        type: [String],
        default: [],
      },

      emails: {
        type: [String],
        default: [],
      },

      website: {
        type: String,
        default: "",
        trim: true,
      },

      facebook: {
        type: String,
        default: "",
        trim: true,
      },

      linkedin: {
        type: String,
        default: "",
        trim: true,
      },
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Doctor", doctorSchema);
