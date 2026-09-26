// server/controllers/prescriptionController.js

// Handles prescription CRUD operations and AI analysis requests.

import Prescription from "../models/Prescription.js";

import { generateMedicalDocumentSummary } from "../services/medicalDocumentAIService.js";

// Fetch all prescriptions belonging to the authenticated user.
export async function getPrescriptions(req, res) {
  try {
    const prescriptions = await Prescription.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    return res.json(prescriptions);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch prescriptions",
    });
  }
}

// Create a new prescription for the authenticated user.
export async function createPrescription(req, res) {
  try {
    const { title, imageUrl } = req.body;

    const prescription = await Prescription.create({
      user: req.userId,
      title,
      imageUrl,
    });

    return res.status(201).json(prescription);
  } catch (err) {
    return res.status(400).json({
      message: "Failed to create prescription",
    });
  }
}

// Generate or return the cached prescription AI summary.
export async function analyzePrescription(req, res) {
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

    if (prescription.aiSummary) {
      return res.json({
        prescription,
        cached: true,
      });
    }

    const summary = await generateMedicalDocumentSummary(prescription.imageUrl);

    prescription.aiSummary = summary;
    prescription.aiAnalyzedAt = new Date();

    await prescription.save();

    return res.json({
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

    return res.status(500).json({
      message: "Failed to analyze prescription.",
    });
  }
}

// Delete a prescription belonging to the authenticated user.
export async function deletePrescription(req, res) {
  try {
    await Prescription.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    return res.json({
      success: true,
    });
  } catch (err) {
    return res.status(400).json({
      message: "Failed to delete prescription",
    });
  }
}
