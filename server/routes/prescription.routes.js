// server/routes/prescription.routes.js

import express from "express";
import Prescription from "../models/Prescription.js";
import auth from "../middleware/auth.js";

import { generatePrescriptionSummary } from "../services/prescriptionAiService.js";

const router = express.Router();

// Get all prescriptions
router.get("/", auth, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch prescriptions",
    });
  }
});

// Create prescription
router.post("/", auth, async (req, res) => {
  try {
    const { title, imageUrl } = req.body;

    const prescription = await Prescription.create({
      user: req.userId,
      title,
      imageUrl,
    });

    res.status(201).json(prescription);
  } catch (err) {
    res.status(400).json({
      message: "Failed to create prescription",
    });
  }
});

// Analyze prescription/report with Gemini
router.post("/:id/analyze", auth, async (req, res) => {
  try {
    const prescription = await Prescription.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    // Return existing analysis if already generated
    if (prescription.aiSummary) {
      return res.json({
        prescription,
        cached: true,
      });
    }

    const summary = await generatePrescriptionSummary(prescription.imageUrl);

    prescription.aiSummary = summary;
    prescription.aiAnalyzedAt = new Date();

    await prescription.save();

    res.json({
      prescription,
      cached: false,
    });
  } catch (err) {
    console.error("Prescription AI analysis failed:", err);

    if (err.status === 429) {
      return res.status(429).json({
        message: "AI request limit reached. Please try again later.",
      });
    }

    res.status(500).json({
      message: "Failed to analyze prescription.",
    });
  }
});

// Delete prescription
router.delete("/:id", auth, async (req, res) => {
  try {
    await Prescription.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(400).json({
      message: "Failed to delete prescription",
    });
  }
});

export default router;
