// server/services/aiChatDataService.js

// Synchronizes profile data and provides reusable health-data operations.
// Keeps profile and health projection logic separate from synchronization orchestration.

import Profile from "../models/Profile.js";
import HealthLog from "../models/HealthLog.js";
import AIChatData from "../models/AIChatData.js";

import { calculateBMI, getBMICategory } from "../utils/healthCalculations.js";

import { emptyHealthData, mapProfileData } from "../utils/aiChatDataHelpers.js";

// Stores the current profile projection for AI chat context.
export async function syncProfileToAIChatData(userId) {
  const profile = await Profile.findOne({
    user: userId,
  }).lean();

  const profileData = mapProfileData(profile);

  // Update the existing projection or create it when missing.
  return AIChatData.findOneAndUpdate(
    {
      user: userId,
    },
    {
      $set: {
        profile: profileData,
        contextVersion: 1,
      },
      $setOnInsert: {
        user: userId,
      },
    },
    {
      upsert: true,
      new: true,
    },
  );
}

// Loads the latest health records required by the AI projection.
export async function getLatestHealthLogs(userId) {
  return Promise.all([
    HealthLog.findOne({
      user: userId,
      type: "bp",
    })
      .sort({
        recordedAt: -1,
        createdAt: -1,
      })
      .lean(),

    HealthLog.findOne({
      user: userId,
      type: "diabetes",
      glucoseTiming: "fasting",
    })
      .sort({
        recordedAt: -1,
        createdAt: -1,
      })
      .lean(),

    HealthLog.findOne({
      user: userId,
      type: "diabetes",
      glucoseTiming: "postMeal",
    })
      .sort({
        recordedAt: -1,
        createdAt: -1,
      })
      .lean(),

    HealthLog.findOne({
      user: userId,
      type: "diabetes",
      glucoseTiming: "random",
    })
      .sort({
        recordedAt: -1,
        createdAt: -1,
      })
      .lean(),

    HealthLog.findOne({
      user: userId,
      type: "weight",
    })
      .sort({
        recordedAt: -1,
        createdAt: -1,
      })
      .lean(),
  ]);
}

// Converts the latest health records into the stored AI health projection.
export function buildHealthData({
  profile,
  bloodPressure,
  fasting,
  postMeal,
  random,
  weight,
}) {
  const healthData = emptyHealthData();

  if (weight) {
    healthData.latestWeight = {
      value: weight.weight ?? null,
      recordedAt: weight.recordedAt || "",
    };
  }

  // BMI remains derived from profile height and the latest weight.
  if (weight?.weight && profile?.height?.feet) {
    const bmi = calculateBMI(weight.weight, profile.height);

    if (bmi !== null) {
      healthData.bmi = {
        value: bmi,
        category: getBMICategory(bmi) || "",
      };
    }
  }

  if (bloodPressure) {
    healthData.bloodPressure = {
      high: bloodPressure.High ?? null,
      low: bloodPressure.Low ?? null,
      recordedAt: bloodPressure.recordedAt || "",
    };
  }

  if (fasting) {
    healthData.bloodSugar.fasting = {
      glucose: fasting.glucose ?? null,
      recordedAt: fasting.recordedAt || "",
    };
  }

  if (postMeal) {
    healthData.bloodSugar.postMeal = {
      glucose: postMeal.glucose ?? null,
      recordedAt: postMeal.recordedAt || "",
    };
  }

  if (random) {
    healthData.bloodSugar.random = {
      glucose: random.glucose ?? null,
      recordedAt: random.recordedAt || "",
    };
  }

  return healthData;
}
