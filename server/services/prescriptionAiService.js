// server/services/prescriptionAiService.js

import axios from "axios";
import { GoogleGenAI } from "@google/genai";

console.log(
  "GEMINI_API_KEY loaded:",
  process.env.GEMINI_API_KEY ? "YES" : "NO",
);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generatePrescriptionSummary(imageUrl) {
  const imageResponse = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });

  const base64Image = Buffer.from(imageResponse.data).toString("base64");

  const mimeType =
    imageResponse.headers["content-type"]?.split(";")[0] || "image/jpeg";

  const prompt = `
    You are an AI health information assistant for a personal health management application.

    Analyze the provided medical document image.

    The image may contain:

    * A medical prescription
    * A laboratory report
    * A diagnostic report
    * A doctor's note
    * Other medical health information

    Your task is to create a very short and clear summary of the document.

    IMPORTANT OUTPUT RULES:

    * Give a name to the document type (e.g., Prescription, Lab Report) with date extracted from the image. ex: "Lab Report Date: 15-Mar-2024"
    * Return only the summary text.
    * Do not use headings or titles.
    * Do not start with phrases like "This document shows".
    * Keep the summary between 20 and 50 words.
    * Use simple and clear language suitable for a Bangladeshi audience.
    * Use bullet points only if they improve clarity.
    * Focus only on the most important findings.
    * give important findings, values, and instructions.
    * dont need to write down the medicine names, dosages, and tests if they are not clearly readable.
    * This is for bangladeshi users, so use very easy english.

    INCLUDE ONLY INFORMATION THAT IS CLEARLY READABLE:

    * Important medicine names
    * Dosages
    * Tests
    * Important values
    * Findings
    * Instructions

    DO NOT:

    * Guess unreadable information.
    * Invent information.
    * Diagnose diseases.
    * Claim certainty about medical conditions.
    * Recommend starting, stopping, or changing medicines.
    * Include patient name, age, address, or unnecessary personal information.
    * Add medical advice beyond what is written in the document.

    If the image is difficult to read, briefly mention that some information could not be clearly interpreted.

    Analyze the image carefully and prioritize accuracy over assumptions.
    `;

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

  return response.text.trim();
}
