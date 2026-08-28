// server/models/Doctor.js

import mongoose from "mongoose";

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

    specialty: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
        type: String,
        default: "",
    },

    hospital: {
      type: String,
      default: "",
      trim: true,
    },

    chamber: {
      type: String,
      default: "",
      trim: true,
    },

    visitingDays: {
      type: String,
      default: "",
    },

    visitingDays: {
    type: [String],
    default: [],
    },

    phone: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);