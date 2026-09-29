// server/services/aiChatStorageService.js

// Handles persistent AI chat creation, retrieval, message storage, and deletion.
// Keeps chat ownership and conversation limits enforced at the storage layer.

import AIChat from "../models/AIChat.js";

import { generateChatResponse } from "./aiChatService.js";

// Creates a new AI conversation for the authenticated user.
export async function createNewAIChat(userId) {
  const chatCount = await AIChat.countDocuments({
    user: userId,
  });

  if (chatCount >= 50) {
    const oldestChat = await AIChat.findOne({
      user: userId,
    })
      .sort({ updatedAt: 1 })
      .select("_id")
      .lean();

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

// Returns the user's latest conversations with user-message counts.
export async function listAIChats(userId) {
  const chats = await AIChat.find({
    user: userId,
  })
    .sort({ updatedAt: -1 })
    .limit(10)
    .lean();

  return chats.map((chat) => {
    const messages = Array.isArray(chat.messages) ? chat.messages : [];

    const userMessageCount = messages.filter(
      (message) => message.role === "user",
    ).length;

    return {
      _id: chat._id,
      title: chat.title,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      userMessageCount,
    };
  });
}

// Returns one complete conversation owned by the authenticated user.
export async function findAIChat(userId, chatId) {
  return AIChat.findOne({
    _id: chatId,
    user: userId,
  }).lean();
}

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

  const userMessage = {
    role: "user",
    content: content.trim(),
  };

  const assistantResponse = await generateChatResponse({
    userId,
    chat,
    userMessage: content.trim(),
  });

  chat.messages.push(userMessage);

  chat.messages.push({
    role: "assistant",
    content: assistantResponse,
  });

  const userMessageCount = chat.messages.filter(
    (message) => message.role === "user",
  ).length;

  if ((!chat.title || chat.title === "New Chat") && userMessageCount === 1) {
    chat.title = content.trim().slice(0, 100) || "New Chat";
  }

  await chat.save();

  const savedChat = chat.toObject();

  return {
    chat: savedChat,
    message: assistantResponse,
    userMessageCount,
  };
}

// Deletes a conversation owned by the authenticated user.
export async function deleteAIChatById(userId, chatId) {
  return AIChat.findOneAndDelete({
    _id: chatId,
    user: userId,
  });
}
