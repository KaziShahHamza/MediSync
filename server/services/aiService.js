// server/services/aiService.js

// Generates cached AI health summaries using Gemini.
// Keeps external AI execution separate from summary persistence and HTTP handling.

import { GoogleGenAI } from "@google/genai";

import { buildAIHealthSummaryPrompt } from "../prompts/aiHealthSummaryPrompt.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Generates a concise AI health summary from the supplied health data.
export async function generateAIHealthSummary(data) {
  const prompt = buildAIHealthSummaryPrompt(data);

  // Execute Gemini with the existing summary generation configuration.
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,

    config: {
      temperature: 0.4,
      maxOutputTokens: 500,
    },
  });

  // Return the normalized Gemini response text.
  return response.text.trim();
}
