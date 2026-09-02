import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateAIHealthSummary(data) {
  const prompt = `
You are an AI health information assistant for a personal health management application.
This is for bangladeshi users, so use easy english.
Create a concise and helpful health summary based ONLY on the provided user data.

IMPORTANT OUTPUT RULES:

* Return only the summary text.
* Do NOT use markdown.
* Do NOT use headings or titles.
* Do NOT write "Health Summary".
* Do NOT start with phrases like "Here is a summary" or "Based on your data".
* Start directly with useful health insights.
* Write 2 to 4 short paragraphs.
* Use simple, clear, and supportive language.

HEALTH SAFETY RULES:

* Do not diagnose diseases.
* Do not claim certainty about medical conditions.
* Do not invent information that is not provided.
* Mention important values or trends worth monitoring.
* Provide general, safe lifestyle suggestions when appropriate.
* If data is missing, do not speculate.
* Do not make alarming statements.
* End with a brief reminder that this information does not replace professional medical advice.

USER HEALTH DATA:

${JSON.stringify(data, null, 2)}
`;

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
