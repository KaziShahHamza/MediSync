// server/models/Prescription.js

import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },

    aiSummary: {
      type: String,
      default: null,
      trim: true,
    },

    aiAnalyzedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Prescription", prescriptionSchema);
