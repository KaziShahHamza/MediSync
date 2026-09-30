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
const MAX_OUTPUT_TOKENS = 210;

// Loads synchronized AI data or rebuilds it when no projection exists.
async function getOrCreateAIChatData(userId) {
  let aiChatData = await AIChatData.findOne({
    user: userId,
  }).lean();

  if (!aiChatData) {
    await syncAllAIChatData(userId);

    aiChatData = await AIChatData.findOne({
      user: userId,
    }).lean();
  }

  return aiChatData;
}

// Converts Gemini failures into safe application-level error codes.
function createAIServiceError(error) {
  const originalMessage = String(error?.message || "").toLowerCase();

  if (
    originalMessage.includes("timeout") ||
    originalMessage.includes("timed out") ||
    originalMessage.includes("deadline")
  ) {
    const timeoutError = new Error("AI response timed out.");
    timeoutError.code = "AI_TIMEOUT";

    return timeoutError;
  }

  if (
    error?.status === 429 ||
    originalMessage.includes("rate limit") ||
    originalMessage.includes("too many requests") ||
    originalMessage.includes("resource exhausted")
  ) {
    const rateLimitError = new Error("AI service is temporarily busy.");
    rateLimitError.code = "AI_RATE_LIMIT";

    return rateLimitError;
  }

  const generationError = new Error("AI generation failed.");
  generationError.code = "AI_GENERATION_FAILED";

  return generationError;
}

// Generates a Gemini response using the user's synchronized health context.
export async function generateChatResponse({ userId, chat, userMessage }) {
  const aiChatData = await getOrCreateAIChatData(userId);

  if (!aiChatData) {
    const error = new Error("Unable to load AI health context.");
    error.code = "AI_CONTEXT_UNAVAILABLE";

    throw error;
  }

  const aiContext = buildAIContext(aiChatData);
  const contextPrompt = buildContextPrompt(aiContext);

  const conversationHistory = buildConversationHistory(chat.messages);

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

  let response;

  try {
    response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
        maxOutputTokens: MAX_OUTPUT_TOKENS,
      },
    });
  } catch (error) {
    throw createAIServiceError(error);
  }

  const text = response.text?.trim();

  if (!text) {
    const error = new Error("AI returned an empty response.");
    error.code = "AI_EMPTY_RESPONSE";

    throw error;
  }

  return text;
}

export { calculateAge, buildAIContext, findMatchingDoctors };
