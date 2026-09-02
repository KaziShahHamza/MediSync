// server/models/AIReport.js

import mongoose from "mongoose";

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
  }
);

export default mongoose.model("AIReport", aiReportSchema);