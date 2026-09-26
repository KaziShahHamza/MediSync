// server/controllers/aiSummaryController.js

// Handles HTTP requests for cached and manually generated AI summaries.
// Keeps response handling separate from AI summary business logic.

import {
  getCachedOrGeneratedSummary,
  generateFreshSummary,
} from "../services/aiSummaryService.js";

// Returns a cached summary or generates a new summary when required.
export async function getAISummary(req, res) {
  try {
    const result = await getCachedOrGeneratedSummary(req.userId);

    res.json(result);
  } catch (error) {
    console.error("Failed to get AI health summary:", error);

    if (error.status === 429) {
      return res.status(429).json({
        message: "AI request limit reached. Please try again later.",
      });
    }

    res.status(500).json({
      message: "Failed to generate AI health summary.",
    });
  }
}

// Generates a fresh AI summary while enforcing the existing cooldown.
export async function generateAISummary(req, res) {
  try {
    const result = await generateFreshSummary(req.userId);

    res.json(result);
  } catch (error) {
    console.error("Manual AI summary generation failed:", error);

    if (error.status === 429) {
      return res.status(429).json({
        message: "AI request limit reached. Please try again later.",
      });
    }

    if (error.status === 400) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: "Failed to generate AI health summary.",
    });
  }
}
