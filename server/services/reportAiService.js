import axios from "axios";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateReportSummary(imageUrl) {
  const imageResponse = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });

  const base64Image = Buffer.from(imageResponse.data).toString("base64");

  const mimeType =
    imageResponse.headers["content-type"]?.split(";")[0] || "image/jpeg";

  const prompt = `
    You are an AI health information assistant for a personal health management application.

    Analyze the provided medical report image.

    The image may contain:

    * A laboratory report
    * A diagnostic report
    * A blood test report
    * An imaging report
    * A doctor's note
    * Other medical health information

    Your task is to create a very short and clear summary of the report.

    IMPORTANT OUTPUT RULES:

    * Give the document type and date if clearly readable.
      Example: "Blood Test Report Date: 15-Mar-2024"
    * Return only the summary text.
    * Do not use headings or titles.
    * Do not start with phrases like "This document shows".
    * Keep the summary between 20 and 50 words.
    * Use simple and clear English suitable for a Bangladeshi audience.
    * Use bullet points only if they improve clarity.
    * Focus only on the most important findings.
    * Include important test names, values, reference ranges, and findings when clearly readable.
    * Do not list every test if it is not necessary.
    * Do not guess unreadable information.

    INCLUDE ONLY INFORMATION THAT IS CLEARLY READABLE:

    * Report type
    * Report date
    * Important test names
    * Important values
    * Reference ranges
    * Important findings
    * Doctor's instructions if clearly written

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
