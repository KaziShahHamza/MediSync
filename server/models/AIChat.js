// server/models/AIChat.js

import mongoose from "mongoose";

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
  { _id: true }
);

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
  }
);

aiChatSchema.index({ user: 1, updatedAt: -1 });

export default mongoose.model("AIChat", aiChatSchema);