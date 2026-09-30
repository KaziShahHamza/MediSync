// server/models/AIChat.js

// Defines persistent AI chat conversations and message schemas.
// Stores user-owned text conversations and supports conversation/message limits.

import mongoose from "mongoose";

export const AI_CHAT_LIMIT = 10;
export const AI_CHAT_DAILY_CREATE_LIMIT = 2;
export const AI_CHAT_MESSAGE_LIMIT = 20;

export const AI_CHAT_USER_MESSAGE_MAX_LENGTH = 350;
export const AI_CHAT_ASSISTANT_MESSAGE_MAX_LENGTH = 800;

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
      validate: {
        validator(value) {
          const maxLength =
            this.role === "assistant"
              ? AI_CHAT_ASSISTANT_MESSAGE_MAX_LENGTH
              : AI_CHAT_USER_MESSAGE_MAX_LENGTH;

          return value.length <= maxLength;
        },

        message(props) {
          const maxLength =
            props.value?.length > AI_CHAT_ASSISTANT_MESSAGE_MAX_LENGTH
              ? AI_CHAT_ASSISTANT_MESSAGE_MAX_LENGTH
              : AI_CHAT_USER_MESSAGE_MAX_LENGTH;

          return `Message cannot exceed ${maxLength} characters.`;
        },
      },
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
