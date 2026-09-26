// server/routes/ai.routes.js

// Defines authenticated AI summary and chat endpoints.
// Delegates request handling to controllers and validation middleware.

import express from "express";

import auth from "../middlewares/auth.js";
import { validateAIChatMessage } from "../middlewares/aiChatValidation.js";

import {
  getAISummary,
  generateAISummary,
} from "../controllers/aiSummaryController.js";

import {
  getAIChats,
  getAIChat,
  createAIChat,
  sendAIChatMessage,
  deleteAIChat,
} from "../controllers/aiChatController.js";

const router = express.Router();

// Register cached and manual AI summary endpoints.
router.get("/summary", auth, getAISummary);
router.post("/summary/generate", auth, generateAISummary);

// Register AI chat management endpoints.
router.get("/chats", auth, getAIChats);
router.get("/chats/:chatId", auth, getAIChat);
router.post("/chats", auth, createAIChat);

// Validate chat messages before reaching the controller.
router.post(
  "/chats/:chatId/messages",
  auth,
  validateAIChatMessage,
  sendAIChatMessage,
);

router.delete("/chats/:chatId", auth, deleteAIChat);

export default router;
