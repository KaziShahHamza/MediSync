// server/services/aiSummaryService.js

// Contains AI summary caching, cooldown, health-data, and persistence logic.
// Keeps summary business rules outside the HTTP controllers.

import AIReport from "../models/AIReport.js";

import { getAIHealthData } from "./dashboardService.js";
import { generateAIHealthSummary } from "./aiService.js";

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
const GENERATE_COOLDOWN_MS = 10 * 60 * 1000;

// Checks whether the supplied health data contains meaningful information.
function hasMeaningfulHealthData(data) {
  const hasProfileData =
    data.profile &&
    (data.profile.gender ||
      data.profile.height?.feet ||
      data.profile.height?.inches ||
      data.profile.allergies ||
      data.profile.chronicIllnesses?.length);

  return Boolean(
    data.bloodPressure ||
    data.diabetes ||
    data.weight ||
    data.bmi ||
    data.medicines.length ||
    hasProfileData,
  );
}

// Loads an existing report and returns it when the cached value is fresh.
export async function getCachedOrGeneratedSummary(userId) {
  const existingReport = await AIReport.findOne({
    user: userId,
  });

  if (existingReport) {
    const reportIsFresh =
      Date.now() - new Date(existingReport.generatedAt).getTime() < WEEK_IN_MS;

    if (reportIsFresh) {
      return {
        summary: existingReport.summary,
        generatedAt: existingReport.generatedAt,
        cached: true,
      };
    }
  }

  const healthData = await getAIHealthData(userId);

  // Avoid calling Gemini when the user has insufficient health information.
  if (!hasMeaningfulHealthData(healthData)) {
    return {
      summary: null,
      generatedAt: null,
      cached: false,
      message: "Add health information to receive personalized AI insights.",
    };
  }

  return saveGeneratedSummary(healthData, userId);
}

// Generates a fresh summary after enforcing the existing ten-minute cooldown.
export async function generateFreshSummary(userId) {
  const existingReport = await AIReport.findOne({
    user: userId,
  });

  // Prevent repeated manual AI requests within the cooldown period.
  if (existingReport?.generatedAt) {
    const generatedAt = new Date(existingReport.generatedAt).getTime();
    const cooldownEndsAt = generatedAt + GENERATE_COOLDOWN_MS;
    const remainingTime = cooldownEndsAt - Date.now();

    if (remainingTime > 0) {
      const remainingSeconds = Math.ceil(remainingTime / 1000);

      const error = new Error(
        "Please wait before generating another AI summary.",
      );

      error.status = 429;
      error.remainingSeconds = remainingSeconds;
      error.cooldownEndsAt = new Date(cooldownEndsAt).toISOString();

      throw error;
    }
  }

  const healthData = await getAIHealthData(userId);

  // Reject generation when there is no meaningful health information.
  if (!hasMeaningfulHealthData(healthData)) {
    const error = new Error(
      "Add health information before generating an AI summary.",
    );

    error.status = 400;

    throw error;
  }

  return saveGeneratedSummary(healthData, userId);
}

// Generates and persists the supplied health summary.
async function saveGeneratedSummary(healthData, userId) {
  const summary = await generateAIHealthSummary(healthData);

  const report = await AIReport.findOneAndUpdate(
    {
      user: userId,
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

  return {
    summary: report.summary,
    generatedAt: report.generatedAt,
    cached: false,
  };
}
