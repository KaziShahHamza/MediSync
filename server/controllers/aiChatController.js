// server/controllers/aiChatController.js

// Handles HTTP requests for AI chat creation, retrieval, messaging, and deletion.
// Delegates chat persistence, quota enforcement, and AI generation to services.

import {
  listAIChats,
  findAIChat,
  createNewAIChat,
  deleteAIChatById,
  addAIChatMessage,
} from "../services/aiChatStorageService.js";

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
      messageLimit: 20,
      reachedMessageLimit: userMessageCount >= 20,
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
      messageLimit: 20,
      reachedMessageLimit: false,
    });
  } catch (error) {
    console.error("Failed to create AI chat:", error);

    if (error.code === "DAILY_CHAT_LIMIT") {
      return res.status(429).json({
        message:
          "You have reached today's chat creation limit. You can create new chats again tomorrow.",
        code: "DAILY_CHAT_LIMIT",
      });
    }

    res.status(500).json({
      message: "Failed to create chat.",
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
      });
    }

    res.json(result);
  } catch (error) {
    console.error("Failed to send AI chat message:", error);

    if (error.code === "CHAT_MESSAGE_LIMIT") {
      return res.status(429).json({
        message:
          "This chat has reached its 20-message limit. Please create a new chat.",
        code: "CHAT_MESSAGE_LIMIT",
      });
    }

    res.status(500).json({
      message: "Failed to generate assistant response.",
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
