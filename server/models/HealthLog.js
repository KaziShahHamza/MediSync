// server/models/HealthLog.js

// Defines user health measurements and their recording metadata.
// Supports blood pressure, blood sugar, and weight tracking.

import mongoose from "mongoose";

// Defines the health measurement document structure.
const healthLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["bp", "diabetes", "weight"],
      required: true,
    },

    High: Number,
    Low: Number,

    glucose: Number,
    glucoseTiming: {
      type: String,
      enum: ["fasting", "postMeal", "random"],
    },

    recordedAt: {
      type: String,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },

    weight: Number,

    note: String,

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model("HealthLog", healthLogSchema);
