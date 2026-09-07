import express from "express";
import Report from "../models/Report.js";
import auth from "../middleware/auth.js";

import { generateReportSummary } from "../services/reportAiService.js";

const router = express.Router();

// Get all reports
router.get("/", auth, async (req, res) => {
  try {
    const reports = await Report.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json(reports);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch reports",
    });
  }
});

// Create report
router.post("/", auth, async (req, res) => {
  try {
    const { title, imageUrl } = req.body;

    const report = await Report.create({
      user: req.userId,
      title,
      imageUrl,
    });

    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({
      message: "Failed to create report",
    });
  }
});

// Analyze report with Gemini
router.post("/:id/analyze", auth, async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    // Return existing analysis if already generated
    if (report.aiSummary) {
      return res.json({
        report,
        cached: true,
      });
    }

    const summary = await generateReportSummary(report.imageUrl);

    report.aiSummary = summary;
    report.aiAnalyzedAt = new Date();

    await report.save();

    res.json({
      report,
      cached: false,
    });
  } catch (err) {
    console.error("Report AI analysis failed:", err);

    if (err.status === 429) {
      return res.status(429).json({
        message: "AI request limit reached. Please try again later.",
      });
    }

    res.status(500).json({
      message: "Failed to analyze report.",
    });
  }
});

// Delete report
router.delete("/:id", auth, async (req, res) => {
  try {
    await Report.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(400).json({
      message: "Failed to delete report",
    });
  }
});

export default router;