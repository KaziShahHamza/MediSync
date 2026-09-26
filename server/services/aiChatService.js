// server/services/aiChatService.js

// Generates Gemini chat responses using synchronized user health context.
// Handles AI context loading, prompt construction, conversation history, and Gemini execution.

import { GoogleGenAI } from "@google/genai";

import AIChatData from "../models/AIChatData.js";

import { syncAllAIChatData } from "./aiChatDataSyncService.js";

import {
  buildAIContext,
  buildConversationHistory,
  findMatchingDoctors,
  calculateAge,
} from "../utils/aiChatContext.js";

import {
  SYSTEM_INSTRUCTION,
  buildContextPrompt,
} from "../prompts/aiChatPrompt.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-3.5-flash-lite";

// Loads synchronized AI data or rebuilds it when no projection exists.
async function getOrCreateAIChatData(userId) {
  let aiChatData = await AIChatData.findOne({
    user: userId,
  }).lean();

  // Build the projection before attempting to load missing AI context.
  if (!aiChatData) {
    await syncAllAIChatData(userId);

    aiChatData = await AIChatData.findOne({
      user: userId,
    }).lean();
  }

  return aiChatData;
}

// Generates a Gemini response using the user's synchronized health context.
export async function generateChatResponse({ userId, chat, userMessage }) {
  const aiChatData = await getOrCreateAIChatData(userId);

  if (!aiChatData) {
    throw new Error("Unable to load AI health context.");
  }

  const aiContext = buildAIContext(aiChatData);
  const contextPrompt = buildContextPrompt(aiContext);
  const conversationHistory = buildConversationHistory(chat.messages);

  // Preserve the existing Gemini content ordering.
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: contextPrompt,
        },
      ],
    },

    ...conversationHistory,

    {
      role: "user",
      parts: [
        {
          text: userMessage,
        },
      ],
    },
  ];

  // Execute the Gemini request with the existing generation configuration.
  const response = await ai.models.generateContent({
    model: MODEL,

    contents,

    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.3,
      maxOutputTokens: 400,
    },
  });

  const text =
    response.text?.trim() ||
    "I'm sorry, but I couldn't generate a response right now.";

  return {
    text,
    doctors: [],
  };
}

export { calculateAge, buildAIContext, findMatchingDoctors };
