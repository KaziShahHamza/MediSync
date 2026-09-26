// server/models/EmergencyAlert.js

// Defines emergency alert records linked to health logs.
// Tracks alert status, recipients, trigger data, and delivery errors.

import mongoose from "mongoose";

// Defines the emergency alert document structure.
const emergencyAlertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    healthLog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HealthLog",
      required: true,
    },

    type: {
      type: String,
      enum: ["bloodPressure", "bloodSugar"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },

    triggerData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    emailRecipients: {
      type: [String],
      default: [],
    },

    sentAt: {
      type: Date,
      default: null,
    },

    errorMessage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// Prevents duplicate alerts for the same health log and alert type.
emergencyAlertSchema.index(
  {
    user: 1,
    healthLog: 1,
    type: 1,
  },
  {
    unique: true,
  },
);

const EmergencyAlert = mongoose.model("EmergencyAlert", emergencyAlertSchema);

export default EmergencyAlert;
