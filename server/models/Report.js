// server/models/Report.js

// Defines medical report records owned by users.
// Stores report metadata and optional AI-generated summaries.

import mongoose from "mongoose";

// Defines the report document structure.
const reportSchema = new mongoose.Schema(
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

export default mongoose.model("Report", reportSchema);
