// server/models/Prescription.js

// Defines prescription records owned by individual users.
// Stores document metadata and optional AI-generated summaries.

import mongoose from "mongoose";

// Defines the prescription document structure.
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
