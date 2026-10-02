// server/services/aiChatMessageService.js

// Handles AI chat message validation, Gemini response generation, and persistence.
// Keeps message-specific operations separate from conversation lifecycle management.

import AIChat, {
  AI_CHAT_MESSAGE_LIMIT,
  AI_CHAT_USER_MESSAGE_MAX_LENGTH,
} from "../models/AIChat.js";

import { generateChatResponse } from "./aiChatService.js";

// Creates a user message and generates the corresponding assistant response.
export async function addAIChatMessage({ userId, chatId, content }) {
  const chat = await AIChat.findOne({
    _id: chatId,
    user: userId,
  });

  if (!chat) {
    return {
      notFound: true,
    };
  }

  const userMessageCount = chat.messages.filter(
    (message) => message.role === "user",
  ).length;

  if (userMessageCount >= AI_CHAT_MESSAGE_LIMIT) {
    const error = new Error(
      `This chat has reached its ${AI_CHAT_MESSAGE_LIMIT}-message limit.`,
    );

    error.code = "CHAT_MESSAGE_LIMIT";

    throw error;
  }

  const trimmedContent = typeof content === "string" ? content.trim() : "";

  if (!trimmedContent) {
    const error = new Error("Message is required.");
    error.code = "INVALID_CHAT_MESSAGE";

    throw error;
  }

  if (trimmedContent.length > AI_CHAT_USER_MESSAGE_MAX_LENGTH) {
    const error = new Error(
      `Message must be ${AI_CHAT_USER_MESSAGE_MAX_LENGTH} characters or fewer.`,
    );

    error.code = "CHAT_MESSAGE_TOO_LONG";

    throw error;
  }

  // Generates the assistant response before changing the stored conversation.
  const assistantResponse = await generateChatResponse({
    userId,
    chat,
    userMessage: trimmedContent,
  });

  if (!assistantResponse?.trim()) {
    const error = new Error("AI returned an empty response.");
    error.code = "AI_EMPTY_RESPONSE";

    throw error;
  }

  chat.messages.push({
    role: "user",
    content: trimmedContent,
  });

  chat.messages.push({
    role: "assistant",
    content: assistantResponse.trim(),
  });

  const updatedUserMessageCount = chat.messages.filter(
    (message) => message.role === "user",
  ).length;

  if (
    (!chat.title || chat.title === "New Chat") &&
    updatedUserMessageCount === 1
  ) {
    chat.title = trimmedContent.slice(0, 100) || "New Chat";
  }

  await chat.save();

  const savedChat = chat.toObject();

  return {
    chat: savedChat,
    message: assistantResponse.trim(),
    userMessageCount: updatedUserMessageCount,
    messageLimit: AI_CHAT_MESSAGE_LIMIT,
    reachedMessageLimit: updatedUserMessageCount >= AI_CHAT_MESSAGE_LIMIT,
  };
}
