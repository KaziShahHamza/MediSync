// server/controllers/aiChatController.js

// Handles HTTP requests for AI chat creation, retrieval, messaging, and deletion.
// Delegates chat persistence, quota enforcement, and AI generation to services.

import {
  listAIChats,
  findAIChat,
  createNewAIChat,
  deleteAIChatById,
} from "../services/aiChatStorageService.js";

import { addAIChatMessage } from "../services/aiChatMessageService.js";

import { AI_CHAT_MESSAGE_LIMIT } from "../models/AIChat.js";

// Returns the user's recent AI chats and current chat usage.
export async function getAIChats(req, res) {
  try {
    const result = await listAIChats(req.userId);

    res.json(result);
  } catch (error) {
    console.error("Failed to fetch AI chats:", error);

    res.status(500).json({
      message: "Failed to fetch chats.",
    });
  }
}

// Returns one AI chat belonging to the authenticated user.
export async function getAIChat(req, res) {
  try {
    const chat = await findAIChat(req.userId, req.params.chatId);

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found.",
      });
    }

    const userMessageCount = chat.messages.filter(
      (message) => message.role === "user",
    ).length;

    res.json({
      ...chat,
      userMessageCount,
      messageLimit: AI_CHAT_MESSAGE_LIMIT,
      reachedMessageLimit: userMessageCount >= AI_CHAT_MESSAGE_LIMIT,
    });
  } catch (error) {
    console.error("Failed to fetch AI chat:", error);

    res.status(500).json({
      message: "Failed to fetch chat.",
    });
  }
}

// Creates a new AI chat while enforcing daily and total limits.
export async function createAIChat(req, res) {
  try {
    const chat = await createNewAIChat(req.userId);

    res.status(201).json({
      ...chat.toObject(),
      userMessageCount: 0,
      messageLimit: AI_CHAT_MESSAGE_LIMIT,
      reachedMessageLimit: false,
    });
  } catch (error) {
    console.error("Failed to create AI chat:", error);

    if (error.code === "DAILY_CHAT_LIMIT") {
      return res.status(429).json({
        message:
          "You've reached today's 2-chat limit. You can create a new conversation tomorrow.",
        code: "DAILY_CHAT_LIMIT",
      });
    }

    res.status(500).json({
      message: "We couldn't create a new chat right now. Please try again.",
      code: "CHAT_CREATION_FAILED",
    });
  }
}

// Generates and stores an assistant response for an existing AI chat.
export async function sendAIChatMessage(req, res) {
  try {
    const { content } = req.body;

    const result = await addAIChatMessage({
      userId: req.userId,
      chatId: req.params.chatId,
      content,
    });

    if (result.notFound) {
      return res.status(404).json({
        message: "Chat not found.",
        code: "CHAT_NOT_FOUND",
      });
    }

    res.json(result);
  } catch (error) {
    console.error("Failed to send AI chat message:", error);

    if (error.code === "CHAT_MESSAGE_LIMIT") {
      return res.status(429).json({
        message: `This chat has reached its ${AI_CHAT_MESSAGE_LIMIT}-message limit. Please create a new chat to continue.`,
        code: "CHAT_MESSAGE_LIMIT",
      });
    }

    if (error.code === "AI_TIMEOUT") {
      return res.status(504).json({
        message:
          "The assistant is taking longer than expected. Please try a shorter or more focused question.",
        code: "AI_TIMEOUT",
      });
    }

    if (error.code === "AI_RATE_LIMIT") {
      return res.status(429).json({
        message:
          "The assistant is temporarily busy. Please wait a moment and try again.",
        code: "AI_RATE_LIMIT",
      });
    }

    if (error.code === "AI_EMPTY_RESPONSE") {
      return res.status(502).json({
        message:
          "I couldn't generate a useful answer this time. Please try rephrasing your question.",
        code: "AI_EMPTY_RESPONSE",
      });
    }

    if (error.code === "AI_CONTEXT_UNAVAILABLE") {
      return res.status(503).json({
        message:
          "Your health information is temporarily unavailable. Please try again in a moment.",
        code: "AI_CONTEXT_UNAVAILABLE",
      });
    }

    if (error.code === "AI_GENERATION_FAILED") {
      return res.status(502).json({
        message:
          "I couldn't answer that right now. Please try again in a moment.",
        code: "AI_GENERATION_FAILED",
      });
    }

    res.status(500).json({
      message:
        "I couldn't generate a response right now. Please try again in a moment.",
      code: "AI_CHAT_FAILED",
    });
  }
}

// Deletes an AI chat belonging to the authenticated user.
export async function deleteAIChat(req, res) {
  try {
    const deletedChat = await deleteAIChatById(req.userId, req.params.chatId);

    if (!deletedChat) {
      return res.status(404).json({
        message: "Chat not found.",
      });
    }

    res.json({
      message: "Chat deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete AI chat:", error);

    res.status(500).json({
      message: "Failed to delete chat.",
    });
  }
}
