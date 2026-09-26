// server/models/Doctor.js

// Defines doctor profiles and their chamber information.
// Stores professional, contact, and appointment-related details.

import mongoose from "mongoose";

// Defines reusable chamber information for each doctor.
const chamberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      trim: true,
    },

    district: {
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

    visitFee: {
      type: Number,
      min: 0,
      default: null,
    },

    visitingDays: {
      type: [String],
      default: [],
    },

    visitingTime: {
      startHour: {
        type: Number,
        min: 1,
        max: 12,
        default: null,
      },

      startPeriod: {
        type: String,
        enum: ["AM", "PM", null],
        default: null,
      },

      endHour: {
        type: Number,
        min: 1,
        max: 12,
        default: null,
      },

      endPeriod: {
        type: String,
        enum: ["AM", "PM", null],
        default: null,
      },
    },
  },
  { _id: true },
);

// Defines the main doctor record and user ownership.
const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

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

    lastVisit: {
      type: Number,
      default: null,
    },

    chambers: {
      type: [chamberSchema],
      default: [],
    },

    contactInfo: {
      phones: {
        type: [String],
        default: [],
      },

      emails: {
        type: [String],
        default: [],
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
