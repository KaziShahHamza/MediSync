// server/services/dashboardService.js

import Profile from "../models/Profile.js";
import HealthLog from "../models/HealthLog.js";
import Medicine from "../models/Medicine.js";
import Doctor from "../models/Doctor.js";
import Prescription from "../models/Prescription.js";

import {
  calculateBMI,
  getBMICategory,
} from "../utils/healthCalculations.js";

// Fast dashboard data
export async function getDashboardData(userId) {
  const profile = await Profile.findOne({
    user: userId,
  }).populate("user", "name email");

  const latestBP = await HealthLog.findOne({
    user: userId,
    type: "bp",
  }).sort({ createdAt: -1 });

  const latestDiabetes = await HealthLog.findOne({
    user: userId,
    type: "diabetes",
  }).sort({ createdAt: -1 });

  const latestWeight = await HealthLog.findOne({
    user: userId,
    type: "weight",
  }).sort({ createdAt: -1 });

  const medicineCount = await Medicine.countDocuments({
    user: userId,
  });

  const doctorCount = await Doctor.countDocuments({
    user: userId,
  });

  const prescriptionCount = await Prescription.countDocuments({
    user: userId,
  });

  const bmiValue = calculateBMI(
    latestWeight?.weight,
    profile?.height
  );

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

      diabetes: latestDiabetes
        ? {
            glucose: latestDiabetes.glucose,
            date: latestDiabetes.createdAt,
          }
        : null,

      bmi,
    },

    summary: {
      medicines: medicineCount,
      doctors: doctorCount,
      prescriptions: prescriptionCount,
    },
  };
}


// Detailed health data for AI summary generation
export async function getAIHealthData(userId) {
  const profile = await Profile.findOne({
    user: userId,
  });

  const latestBP = await HealthLog.findOne({
    user: userId,
    type: "bp",
  }).sort({ createdAt: -1 });

  const latestDiabetes = await HealthLog.findOne({
    user: userId,
    type: "diabetes",
  }).sort({ createdAt: -1 });

  const latestWeight = await HealthLog.findOne({
    user: userId,
    type: "weight",
  }).sort({ createdAt: -1 });

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

  const medicines = await Medicine.find({
    user: userId,
  }).select("name dosageTimes");

  const bmiValue = calculateBMI(
    latestWeight?.weight,
    profile?.height
  );

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

    diabetes: latestDiabetes
      ? {
          glucose: latestDiabetes.glucose,
          date: latestDiabetes.createdAt,
        }
      : null,

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
        date: log.createdAt,
      })),

      weight: recentWeight.map((log) => ({
        weight: log.weight,
        date: log.createdAt,
      })),
    },
  };
}