// server/controllers/aiChatController.js

// Handles HTTP requests for AI chat creation, retrieval, messaging, and deletion.
// Delegates chat persistence and AI generation to dedicated services.

import {
  listAIChats,
  findAIChat,
  createNewAIChat,
  deleteAIChatById,
  addAIChatMessage,
} from "../services/aiChatStorageService.js";

// Returns the user's ten most recently updated AI chats.
export async function getAIChats(req, res) {
  try {
    const chats = await listAIChats(req.userId);

    res.json(chats);
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

    res.json(chat);
  } catch (error) {
    console.error("Failed to fetch AI chat:", error);

    res.status(500).json({
      message: "Failed to fetch chat.",
    });
  }
}

// Creates a new AI chat while preserving the existing fifty-chat limit.
export async function createAIChat(req, res) {
  try {
    const chat = await createNewAIChat(req.userId);

    res.status(201).json(chat);
  } catch (error) {
    console.error("Failed to create AI chat:", error);

    res.status(500).json({
      message: "Failed to create chat.",
    });
  }
}

// Generates and stores an assistant response for an existing AI chat.
export async function sendAIChatMessage(req, res) {
  try {
    const { content, imageUrls = [] } = req.body;

    const result = await addAIChatMessage({
      userId: req.userId,
      chatId: req.params.chatId,
      content,
      imageUrls,
    });

    if (result.notFound) {
      return res.status(404).json({
        message: "Chat not found.",
      });
    }

    res.json(result);
  } catch (error) {
    console.error("Failed to send AI chat message:", error);

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
