// server/models/AIChat.js

// Defines persistent AI chat conversations and message schemas.
// Stores user-owned text conversations and supports conversation/message limits.

import mongoose from "mongoose";

export const AI_CHAT_LIMIT = 10;
export const AI_CHAT_DAILY_CREATE_LIMIT = 2;
export const AI_CHAT_MESSAGE_LIMIT = 20;

// Defines the schema for individual conversation messages.
const aiChatMessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 350,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true },
);

// Defines the schema for user-owned AI conversations.
const aiChatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      default: "New Chat",
      trim: true,
      maxlength: 100,
    },

    messages: {
      type: [aiChatMessageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// Supports efficient retrieval of a user's latest conversations.
aiChatSchema.index({ user: 1, updatedAt: -1 });

// Supports efficient lookup of the user's oldest conversation.
aiChatSchema.index({ user: 1, createdAt: 1 });

export default mongoose.model("AIChat", aiChatSchema);
