// server/services/exportService.js

// Collects the user's health data required for PDF export.
// Prepares the complete report data structure for PDF generation.

import User from "../models/User.js";
import Profile from "../models/Profile.js";
import Medicine from "../models/Medicine.js";
import HealthLog from "../models/HealthLog.js";
import Doctor from "../models/Doctor.js";
import AIReport from "../models/AIReport.js";
import Prescription from "../models/Prescription.js";

import { calculateBMI, getBMICategory } from "../utils/healthCalculations.js";

// Fetches and prepares all data required for the health report.
export async function getHealthReportData(userId) {
  // Fetch the authenticated user's basic information.
  const user = await User.findById(userId).select("name email");

  // Fetch the user's profile information.
  const profile = await Profile.findOne({
    user: userId,
  });

  // Fetch the latest blood pressure record.
  const latestBP = await HealthLog.findOne({
    user: userId,
    type: "bp",
  }).sort({
    createdAt: -1,
  });

  // Fetch the latest glucose records by measurement type.
  const latestFasting = await HealthLog.findOne({
    user: userId,
    type: "diabetes",
    glucoseTiming: "fasting",
  }).sort({
    createdAt: -1,
  });

  const latestPostMeal = await HealthLog.findOne({
    user: userId,
    type: "diabetes",
    glucoseTiming: "postMeal",
  }).sort({
    createdAt: -1,
  });

  const latestRandom = await HealthLog.findOne({
    user: userId,
    type: "diabetes",
    glucoseTiming: "random",
  }).sort({
    createdAt: -1,
  });

  // Fetch the latest weight record for BMI calculation.
  const latestWeight = await HealthLog.findOne({
    user: userId,
    type: "weight",
  }).sort({
    createdAt: -1,
  });

  // Fetch active medicines.
  const medicines = await Medicine.find({
    user: userId,
    isActive: true,
  }).sort({
    startDate: -1,
  });

  // Fetch doctors and prescriptions for the report.
  const doctors = await Doctor.find({
    user: userId,
  }).sort({
    createdAt: -1,
  });

  const prescriptions = await Prescription.find({
    user: userId,
  }).sort({
    createdAt: -1,
  });

  // Fetch the latest cached AI health report.
  const aiReport = await AIReport.findOne({
    user: userId,
  });

  // Calculate BMI from the latest weight and profile height.
  const bmiValue = calculateBMI(latestWeight?.weight, profile?.height);

  const bmi = bmiValue
    ? {
        value: bmiValue,
        category: getBMICategory(bmiValue),
        date: latestWeight?.createdAt,
      }
    : null;

  // Prepare the final structure consumed by the PDF service.
  return {
    user,
    profile,

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

      weight: latestWeight
        ? {
            value: latestWeight.weight,
            date: latestWeight.createdAt,
          }
        : null,

      bmi,
    },

    medicines,
    doctors,
    prescriptions,
    aiReport,
  };
}
