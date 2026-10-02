// server/services/aiHealthDataService.js

// Builds the detailed health dataset used by AI summaries.
// Loads current health context, medicines, profile information, and recent health trends.

import Profile from "../models/Profile.js";
import HealthLog from "../models/HealthLog.js";
import Medicine from "../models/Medicine.js";

import { calculateBMI, getBMICategory } from "../utils/healthCalculations.js";

// Builds the detailed health dataset used by AI summaries.
export async function getAIHealthData(userId) {
  // Load the user's profile for health-context information.
  const profile = await Profile.findOne({
    user: userId,
  });

  const latestBP = await HealthLog.findOne({
    user: userId,
    type: "bp",
  }).sort({ createdAt: -1 });

  const latestFasting = await HealthLog.findOne({
    user: userId,
    type: "diabetes",
    glucoseTiming: "fasting",
  }).sort({ createdAt: -1 });

  const latestPostMeal = await HealthLog.findOne({
    user: userId,
    type: "diabetes",
    glucoseTiming: "postMeal",
  }).sort({ createdAt: -1 });

  const latestRandom = await HealthLog.findOne({
    user: userId,
    type: "diabetes",
    glucoseTiming: "random",
  }).sort({ createdAt: -1 });

  const latestWeight = await HealthLog.findOne({
    user: userId,
    type: "weight",
  }).sort({ createdAt: -1 });

  // Load recent measurements for health trend analysis.
  const recentBP = await HealthLog.find({
    user: userId,
    type: "bp",
  })
    .sort({ createdAt: -1 })
    .limit(5);

  const recentDiabetes = await HealthLog.find({
    user: userId,
    type: "diabetes",
  })
    .sort({ createdAt: -1 })
    .limit(5);

  const recentWeight = await HealthLog.find({
    user: userId,
    type: "weight",
  })
    .sort({ createdAt: -1 })
    .limit(5);

  // Load medicine names and dosage schedules for AI context.
  const medicines = await Medicine.find({
    user: userId,
  }).select("name dosageTimes");

  // Calculate BMI from the latest weight and profile height.
  const bmiValue = calculateBMI(latestWeight?.weight, profile?.height);

  const bmi = bmiValue
    ? {
        value: bmiValue,
        category: getBMICategory(bmiValue),
        weight: latestWeight?.weight,
        date: latestWeight?.createdAt,
      }
    : null;

  return {
    bloodPressure: latestBP
      ? {
          high: latestBP.High,
          low: latestBP.Low,
          date: latestBP.createdAt,
        }
      : null,

    diabetes: {
      fasting: latestFasting
        ? {
            glucose: latestFasting.glucose,
            date: latestFasting.recordedAt || latestFasting.createdAt,
          }
        : null,

      postMeal: latestPostMeal
        ? {
            glucose: latestPostMeal.glucose,
            date: latestPostMeal.recordedAt || latestPostMeal.createdAt,
          }
        : null,

      random: latestRandom
        ? {
            glucose: latestRandom.glucose,
            date: latestRandom.recordedAt || latestRandom.createdAt,
          }
        : null,
    },

    weight: latestWeight
      ? {
          value: latestWeight.weight,
          date: latestWeight.createdAt,
        }
      : null,

    bmi,

    profile: profile
      ? {
          dob: profile.dob,
          gender: profile.gender,
          height: profile.height,
          bloodGroup: profile.bloodGroup,
          allergies: profile.allergies,
          chronicIllnesses: profile.chronicIllnesses,
          smoking: profile.smoking,
          alcohol: profile.alcohol,
          exercise: profile.exercise,
          diet: profile.diet,
        }
      : null,

    medicines: medicines.map((medicine) => ({
      name: medicine.name,
      dosageTimes: medicine.dosageTimes,
    })),

    recentTrends: {
      bloodPressure: recentBP.map((log) => ({
        high: log.High,
        low: log.Low,
        date: log.createdAt,
      })),

      bloodSugar: recentDiabetes.map((log) => ({
        glucose: log.glucose,
        timing: log.glucoseTiming,
        date: log.recordedAt || log.createdAt,
      })),

      weight: recentWeight.map((log) => ({
        weight: log.weight,
        date: log.createdAt,
      })),
    },
  };
}
