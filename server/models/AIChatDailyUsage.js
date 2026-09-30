// server/models/AIChatDailyUsage.js

// Stores persistent daily AI chat creation usage.
// Prevents deleting conversations from restoring the daily creation allowance.

import mongoose from "mongoose";

const aiChatDailyUsageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    dateKey: {
      type: String,
      required: true,
    },

    chatCount: {
      type: Number,
      default: 0,
      min: 0,
      max: 2,
    },
  },
  {
    timestamps: true,
  },
);

aiChatDailyUsageSchema.index(
  {
    user: 1,
    dateKey: 1,
  },
  {
    unique: true,
  },
);

export default mongoose.model("AIChatDailyUsage", aiChatDailyUsageSchema);
