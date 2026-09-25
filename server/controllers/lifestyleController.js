// server/controllers/lifestyleController.js

// Handles lifestyle assessment request and response logic.
// Delegates assessment operations to the lifestyle service.

import {
  createAssessment,
  getAssessments,
  getLatestAssessment,
} from "../services/lifestyleService.js";

// Creates and saves a new lifestyle assessment.
export async function createLifestyleAssessment(req, res) {
  try {
    const { answers } = req.body;

    if (!answers) {
      return res.status(400).json({
        message: "Lifestyle answers are required",
      });
    }

    const assessment = await createAssessment(req.userId, answers);

    return res.status(201).json({
      message: "Lifestyle assessment saved successfully",
      assessment,
    });
  } catch (error) {
    console.error("Save lifestyle assessment error:", error);

    return res.status(400).json({
      message: error.message || "Failed to save lifestyle assessment",
    });
  }
}

// Retrieves the user's lifestyle assessment history.
export async function getLifestyleAssessments(req, res) {
  try {
    const assessments = await getAssessments(req.userId);

    return res.status(200).json({
      assessments,
    });
  } catch (error) {
    console.error("Get lifestyle assessments error:", error);

    return res.status(500).json({
      message: "Failed to load lifestyle assessments",
    });
  }
}

// Retrieves the user's latest lifestyle assessment.
export async function getLatestLifestyleAssessment(req, res) {
  try {
    const assessment = await getLatestAssessment(req.userId);

    return res.status(200).json({
      assessment: assessment || null,
    });
  } catch (error) {
    console.error("Get latest lifestyle assessment error:", error);

    return res.status(500).json({
      message: "Failed to load latest lifestyle assessment",
    });
  }
}
