// server/services/aiChatStorageService.js

// Contains database operations for AI chat documents.
// Coordinates persistence with the existing AI response service.

import AIChat from "../models/AIChat.js";

import { generateChatResponse } from "./aiChatService.js";

// Returns the user's ten most recently updated chats.
export async function listAIChats(userId) {
  return AIChat.find({
    user: userId,
  })
    .select("_id title createdAt updatedAt")
    .sort({ updatedAt: -1 })
    .limit(10)
    .lean();
}

// Returns one chat owned by the supplied user.
export async function findAIChat(userId, chatId) {
  return AIChat.findOne({
    _id: chatId,
    user: userId,
  }).lean();
}

// Creates a new chat after removing the oldest chat when the limit is reached.
export async function createNewAIChat(userId) {
  const chatCount = await AIChat.countDocuments({
    user: userId,
  });

  // Preserve the existing fifty-chat maximum.
  if (chatCount >= 50) {
    const oldestChat = await AIChat.findOne({
      user: userId,
    }).sort({ updatedAt: 1 });

    if (oldestChat) {
      await AIChat.deleteOne({
        _id: oldestChat._id,
        user: userId,
      });
    }
  }

  return AIChat.create({
    user: userId,
    title: "New Chat",
    messages: [],
  });
}

// Generates and persists a user message together with its AI response.
export async function addAIChatMessage({ userId, chatId, content, imageUrls }) {
  const message = typeof content === "string" ? content.trim() : "";

  const chat = await AIChat.findOne({
    _id: chatId,
    user: userId,
  });

  if (!chat) {
    return {
      notFound: true,
    };
  }

  const userMessage = {
    role: "user",
    content: message,
    imageUrls,
  };

  // Generate the assistant response before mutating the stored chat.
  const aiResponse = await generateChatResponse({
    userId,
    chat,
    userMessage: message,
  });

  chat.messages.push(userMessage);

  chat.messages.push({
    role: "assistant",
    content: aiResponse.text,
    imageUrls: [],
  });

  // Generate a useful title from the first user message.
  if (chat.title === "New Chat" && message) {
    chat.title = message.length > 60 ? `${message.slice(0, 57)}...` : message;
  }

  await chat.save();

  return {
    chat,
    message: {
      role: "assistant",
      content: aiResponse.text,
      imageUrls: [],
    },
  };
}

// Deletes one chat only when it belongs to the authenticated user.
export async function deleteAIChatById(userId, chatId) {
  return AIChat.findOneAndDelete({
    _id: chatId,
    user: userId,
  });
}
