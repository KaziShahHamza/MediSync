// server/controllers/exportController.js

// Handles health report export requests and PDF responses.
// Delegates report data preparation and PDF generation to services.

import { getHealthReportData } from "../services/exportService.js";
import { generateHealthReport as generateHealthReportPdf } from "../services/pdfService.js";

// Generates the authenticated user's health report PDF.
export async function generateHealthReport(req, res) {
  try {
    const userId = req.userId;

    const reportData = await getHealthReportData(userId);

    // Set PDF response headers before generation starts.
    const fileName = `MediSync-Health-Report-${Date.now()}.pdf`;

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`,
    );

    await generateHealthReportPdf(res, reportData);
  } catch (error) {
    console.error("Failed to generate health report:", error);

    // Avoid sending another response after PDF output started.
    if (!res.headersSent && !res.writableEnded) {
      res.status(500).json({
        message: "Failed to generate health report.",
      });
    }
  }
}