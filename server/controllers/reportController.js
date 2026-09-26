// server/controllers/reportController.js

// Handles report CRUD operations and AI analysis requests.

import Report from "../models/Report.js";

import { generateMedicalDocumentSummary } from "../services/medicalDocumentAIService.js";

// Fetch all reports belonging to the authenticated user.
export async function getReports(req, res) {
  try {
    const reports = await Report.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    return res.json(reports);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch reports",
    });
  }
}

// Create a new report for the authenticated user.
export async function createReport(req, res) {
  try {
    const { title, imageUrl } = req.body;

    const report = await Report.create({
      user: req.userId,
      title,
      imageUrl,
    });

    return res.status(201).json(report);
  } catch (err) {
    return res.status(400).json({
      message: "Failed to create report",
    });
  }
}

// Generate or return the cached report AI summary.
export async function analyzeReport(req, res) {
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

    if (report.aiSummary) {
      return res.json({
        report,
        cached: true,
      });
    }

    const summary = await generateMedicalDocumentSummary(report.imageUrl);

    report.aiSummary = summary;
    report.aiAnalyzedAt = new Date();

    await report.save();

    return res.json({
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

    return res.status(500).json({
      message: "Failed to analyze report.",
    });
  }
}

// Delete a report belonging to the authenticated user.
export async function deleteReport(req, res) {
  try {
    await Report.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    return res.json({
      success: true,
    });
  } catch (err) {
    return res.status(400).json({
      message: "Failed to delete report",
    });
  }
}
