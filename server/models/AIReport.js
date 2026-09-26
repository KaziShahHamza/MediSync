// server/models/AIReport.js

// Defines the cached AI-generated health report for a user.
// Stores the generated summary and report timestamps.

import mongoose from "mongoose";

// Defines the single report document owned by each user.
const aiReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    summary: {
      type: String,
      required: true,
      trim: true,
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("AIReport", aiReportSchema);
