// server/routes/export.routes.js

import express from "express";

import auth from "../middleware/auth.js";

import User from "../models/User.js";
import Profile from "../models/Profile.js";
import Medicine from "../models/Medicine.js";
import HealthLog from "../models/HealthLog.js";
import Doctor from "../models/Doctor.js";
import AIReport from "../models/AIReport.js";
import Prescription from "../models/Prescription.js";

import { calculateBMI, getBMICategory } from "../utils/healthCalculations.js";

import { generateHealthReport } from "../services/pdfService.js";

const router = express.Router();

router.get("/health-report", auth, async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch user
    const user = await User.findById(userId).select("name email");

    // Fetch profile
    const profile = await Profile.findOne({
      user: userId,
    });

    // Latest health records
    const latestBP = await HealthLog.findOne({
      user: userId,
      type: "bp",
    }).sort({
      createdAt: -1,
    });

    const latestDiabetes = await HealthLog.findOne({
      user: userId,
      type: "diabetes",
    }).sort({
      createdAt: -1,
    });

    const latestWeight = await HealthLog.findOne({
      user: userId,
      type: "weight",
    }).sort({
      createdAt: -1,
    });

    // Medicines
    const medicines = await Medicine.find({
      user: userId,
    }).sort({
      isActive: -1,
      startDate: -1,
    });

    // Doctors
    const doctors = await Doctor.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    // Prescriptions
    const prescriptions = await Prescription.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    // AI report
    const aiReport = await AIReport.findOne({
      user: userId,
    });

    // Calculate BMI
    const bmiValue = calculateBMI(latestWeight?.weight, profile?.height);

    const bmi = bmiValue
      ? {
          value: bmiValue,
          category: getBMICategory(bmiValue),
          date: latestWeight?.createdAt,
        }
      : null;

    // Prepare PDF data
    const reportData = {
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
      },

      medicines,
      doctors,
      prescriptions,
      aiReport,
    };

    // PDF response headers
    const fileName = `MediSync-Health-Report-${Date.now()}.pdf`;

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    await generateHealthReport(res, reportData);
  } catch (error) {
    console.error("Failed to generate health report:", error);

    if (!res.headersSent) {
      res.status(500).json({
        message: "Failed to generate health report.",
      });
    }
  }
});

export default router;
