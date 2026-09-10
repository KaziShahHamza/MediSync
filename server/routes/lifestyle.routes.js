// server/routes/lifestyle.routes.js

import express from "express";

import auth from "../middleware/auth.js";
import LifestyleAssessment from "../models/LifestyleAssessment.js";

import {
  calculateLifestyleScore,
} from "../utils/lifestyleScoring.js";

const router = express.Router();

const MAX_ASSESSMENTS = 10;

// ============================================================
// POST /api/lifestyle
// Save a new lifestyle assessment
// ============================================================

router.post("/", auth, async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers) {
      return res.status(400).json({
        message: "Lifestyle answers are required",
      });
    }

    const result = calculateLifestyleScore(answers);

    const assessment = await LifestyleAssessment.create({
      user: req.userId,
      answers,
      categoryScores: result.categoryScores,
      totalScore: result.totalScore,
      grade: result.grade,
      feedback: result.feedback,
      assessedAt: new Date(),
    });

    // Keep only the newest 10 assessments for this user.
    const assessmentsToKeep = await LifestyleAssessment.find({
      user: req.userId,
    })
      .sort({ assessedAt: -1 })
      .select("_id")
      .lean();

    if (assessmentsToKeep.length > MAX_ASSESSMENTS) {
      const idsToDelete = assessmentsToKeep
        .slice(MAX_ASSESSMENTS)
        .map((item) => item._id);

      await LifestyleAssessment.deleteMany({
        _id: { $in: idsToDelete },
        user: req.userId,
      });
    }

    return res.status(201).json({
      message: "Lifestyle assessment saved successfully",
      assessment,
    });
  } catch (error) {
    console.error("Save lifestyle assessment error:", error);

    return res.status(400).json({
      message:
        error.message || "Failed to save lifestyle assessment",
    });
  }
});

// ============================================================
// GET /api/lifestyle
// Get assessment history
// ============================================================

router.get("/", auth, async (req, res) => {
  try {
    const assessments = await LifestyleAssessment.find({
      user: req.userId,
    })
      .sort({ assessedAt: -1 })
      .limit(MAX_ASSESSMENTS)
      .lean();

    return res.status(200).json({
      assessments,
    });
  } catch (error) {
    console.error("Get lifestyle assessments error:", error);

    return res.status(500).json({
      message: "Failed to load lifestyle assessments",
    });
  }
});

// ============================================================
// GET /api/lifestyle/latest
// Get latest assessment
// ============================================================

router.get("/latest", auth, async (req, res) => {
  try {
    const assessment = await LifestyleAssessment.findOne({
      user: req.userId,
    })
      .sort({ assessedAt: -1 })
      .lean();

    return res.status(200).json({
      assessment: assessment || null,
    });
  } catch (error) {
    console.error("Get latest lifestyle assessment error:", error);

    return res.status(500).json({
      message: "Failed to load latest lifestyle assessment",
    });
  }
});

export default router;