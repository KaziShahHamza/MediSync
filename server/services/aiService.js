// server/services/aiService.js

// Generates the cached AI health summary from supplied user health data.
// Keeps Gemini execution in the service while storing prompt construction separately.

import { GoogleGenAI } from "@google/genai";

import { buildAIHealthSummaryPrompt } from "../prompts/aiHealthSummaryPrompt.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Generates a concise AI health summary from the provided health data.
export async function generateAIHealthSummary(data) {
  const prompt = buildAIHealthSummaryPrompt(data);

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
    config: {
      temperature: 0.4,
      maxOutputTokens: 500,
    },
  });

  return response.text.trim();
}
