// server/models/HealthLog.js
import mongoose from "mongoose";

const healthLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["bp", "diabetes", "bmi"],
      required: true,
    },

    // Blood Pressure
    High: Number,
    Low: Number,

    // Blood Sugar
    glucose: Number,

    // BMI
    height: Number,
    weight: Number,
    bmi: Number,

    note: String,

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("HealthLog", healthLogSchema);