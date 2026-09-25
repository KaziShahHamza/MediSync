// server/services/medicalDocumentAiService.js

// Provides shared Gemini analysis for medical reports and prescriptions.
// Handles image retrieval, encoding, MIME detection, and AI summarization.

import axios from "axios";
import { GoogleGenAI } from "@google/genai";

import { getMedicalDocumentPrompt } from "../prompts/medicalDocumentPrompts.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Downloads and prepares the document image for Gemini.
async function prepareImage(imageUrl) {
  const imageResponse = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });

  const base64Image = Buffer.from(imageResponse.data).toString("base64");

  const mimeType =
    imageResponse.headers["content-type"]?.split(";")[0] || "image/jpeg";

  return {
    base64Image,
    mimeType,
  };
}

// Generates a summary for a supported medical document type.
export async function generateMedicalDocumentSummary(imageUrl, documentType) {
  const { base64Image, mimeType } = await prepareImage(imageUrl);

  const prompt = getMedicalDocumentPrompt(documentType);

  // Send the prepared image and prompt to Gemini.
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",

    contents: [
      {
        inlineData: {
          mimeType,
          data: base64Image,
        },
      },
      {
        text: prompt,
      },
    ],

    config: {
      temperature: 0.2,
      maxOutputTokens: 300,
    },
  });

  // Return only the generated summary text.
  return response.text.trim();
}
