// server/models/AIChatData.js

// Defines the main AI chat context model.
// Combines profile, health, lifestyle, and doctor information for each user.

import mongoose from "mongoose";

import profileSchema from "./aiChatData/profileSchema.js";
import healthSchema from "./aiChatData/healthSchema.js";
import doctorSchema from "./aiChatData/doctorSchema.js";

const aiChatDataSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    profile: {
      type: profileSchema,
      default: {},
    },

    lifestyle: {
      answers: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },

      categoryScores: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },

      totalScore: {
        type: Number,
        default: null,
      },

      grade: {
        type: String,
        default: "",
      },

      feedback: {
        type: String,
        default: "",
      },

      assessedAt: {
        type: Date,
        default: null,
      },
    },

    health: {
      type: healthSchema,
      default: {},
    },

    doctors: {
      type: [doctorSchema],
      default: [],
    },

    contextVersion: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("AIChatData", aiChatDataSchema);
