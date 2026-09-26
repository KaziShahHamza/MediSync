// server/models/AIChat.js

// Defines the persistent AI chat conversation and message schemas.
// Stores user-owned text and optional image attachments.

import mongoose from "mongoose";

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
    },

    imageUrls: {
      type: [String],
      default: [],
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

export default mongoose.model("AIChat", aiChatSchema);
