// server/services/dashboardService.js

// Aggregates fast dashboard data from the user's health records.
// Keeps dashboard-specific queries and summary calculations separate from AI health data.

import Profile from "../models/Profile.js";
import HealthLog from "../models/HealthLog.js";
import Medicine from "../models/Medicine.js";
import Doctor from "../models/Doctor.js";
import Prescription from "../models/Prescription.js";

import { calculateBMI, getBMICategory } from "../utils/healthCalculations.js";

// Builds the fast dashboard data response.
export async function getDashboardData(userId) {
  // Load the user's profile and basic account information.
  const profile = await Profile.findOne({
    user: userId,
  }).populate("user", "name email");

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

  // Count the user's main health-management resources.
  const medicineCount = await Medicine.countDocuments({
    user: userId,
  });

  const doctorCount = await Doctor.countDocuments({
    user: userId,
  });

  const prescriptionCount = await Prescription.countDocuments({
    user: userId,
  });

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
    user: {
      name: profile?.user?.name || "User",
      email: profile?.user?.email || "",
    },

    health: {
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

      bmi,
    },

    summary: {
      medicines: medicineCount,
      doctors: doctorCount,
      prescriptions: prescriptionCount,
    },
  };
}
