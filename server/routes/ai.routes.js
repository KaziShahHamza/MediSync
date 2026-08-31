// server/routes/ai.routes.js

import express from "express";

import auth from "../middleware/auth.js";
import AIReport from "../models/AIReport.js";

import { getAIHealthData } from "../services/dashboardService.js";

import { generateAIHealthSummary } from "../services/aiService.js";

const router = express.Router();

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

// Check if user has enough health data for AI analysis
function hasMeaningfulHealthData(data) {
  const hasProfileData =
    data.profile &&
    (data.profile.gender ||
      data.profile.height?.feet ||
      data.profile.height?.inches ||
      data.profile.allergies ||
      data.profile.chronicIllnesses?.length ||
      data.profile.smoking ||
      data.profile.alcohol ||
      data.profile.exercise ||
      data.profile.diet);

  return Boolean(
    data.bloodPressure ||
    data.diabetes ||
    data.weight ||
    data.bmi ||
    data.medicines.length ||
    hasProfileData,
  );
}

// GET AI summary
router.get("/summary", auth, async (req, res) => {
  try {
    const existingReport = await AIReport.findOne({
      user: req.userId,
    });

    // Return cached summary if it is less than 7 days old
    if (existingReport) {
      const reportIsFresh =
        Date.now() - new Date(existingReport.generatedAt).getTime() <
        WEEK_IN_MS;

      if (reportIsFresh) {
        return res.json({
          summary: existingReport.summary,
          generatedAt: existingReport.generatedAt,
          cached: true,
        });
      }
    }

    // Get latest health data
    const healthData = await getAIHealthData(req.userId);

    // Don't call Gemini if user has no meaningful data
    if (!hasMeaningfulHealthData(healthData)) {
      return res.json({
        summary: null,
        generatedAt: null,
        cached: false,
        message: "Add health information to receive personalized AI insights.",
      });
    }

    // Generate new AI summary
    const summary = await generateAIHealthSummary(healthData);

    const report = await AIReport.findOneAndUpdate(
      {
        user: req.userId,
      },
      {
        summary,
        generatedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
      },
    );

    res.json({
      summary: report.summary,
      generatedAt: report.generatedAt,
      cached: false,
    });
  } catch (error) {
    console.error("Failed to get AI health summary:", error);

    res.status(500).json({
      message: "Failed to generate AI health summary.",
    });
  }
});

// POST manually generate a fresh summary
router.post("/summary/generate", auth, async (req, res) => {
  try {
    const healthData = await getAIHealthData(req.userId);

    // Don't call Gemini if user has no meaningful data
    if (!hasMeaningfulHealthData(healthData)) {
      return res.status(400).json({
        message: "Add health information before generating an AI summary.",
      });
    }

    const summary = await generateAIHealthSummary(healthData);

    const report = await AIReport.findOneAndUpdate(
      {
        user: req.userId,
      },
      {
        summary,
        generatedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
      },
    );

    res.json({
      summary: report.summary,
      generatedAt: report.generatedAt,
      cached: false,
    });
  } catch (error) {
    console.error("Manual AI summary generation failed:", error);

    if (error.status === 429) {
      return res.status(429).json({
        message: "AI request limit reached. Please try again later.",
      });
    }

    res.status(500).json({
      message: "Failed to generate AI health summary.",
    });
  }
});

export default router;
