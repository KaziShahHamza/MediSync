// server/services/pdfService.js

// Orchestrates PDF report generation by coordinating independent report sections.
// Handles the PDF document lifecycle and HTTP response configuration.

import PDFDocument from "pdfkit";

import { renderPersonalSection } from "../utils/pdf/sections/personalSection.js";
import { renderAISummarySection } from "../utils/pdf/sections/aiSummarySection.js";
import { renderHealthSection } from "../utils/pdf/sections/healthSection.js";
import { renderMedicinesSection } from "../utils/pdf/sections/medicinesSection.js";
import { renderDoctorsSection } from "../utils/pdf/sections/doctorsSection.js";
import { renderPrescriptionsSection } from "../utils/pdf/sections/prescriptionsSection.js";
import { renderReportFooter } from "../utils/pdf/sections/reportFooter.js";

// Generates and streams the complete health report PDF.
export async function generateHealthReport(res, data) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
    bufferPages: true,
    info: {
      Title: "MediSync Health Report",
      Author: "MediSync",
      Subject: "Personal Health Report",
    },
  });

  let responseStarted = false;

  // Handles PDF generation errors before or after the response has started.
  const handleError = (error) => {
    console.error("Failed to generate health report PDF:", error);

    if (!responseStarted && !res.headersSent) {
      return res.status(500).json({
        message: "Failed to generate health report.",
      });
    }

    if (!res.destroyed) {
      res.destroy(error);
    }

    return undefined;
  };

  doc.on("error", handleError);

  try {
    // Configure the download response before the PDF stream begins.
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="medisync-health-report.pdf"',
    );

    doc.pipe(res);
    responseStarted = true;

    // Render each report section in a predictable order.
    renderPersonalSection(doc, data);
    renderAISummarySection(doc, data);
    renderHealthSection(doc, data);
    renderMedicinesSection(doc, data);
    renderDoctorsSection(doc, data);

    await renderPrescriptionsSection(doc, data);

    renderReportFooter(doc, data);

    // Finalize the PDF stream after every section has been rendered.
    doc.end();
  } catch (error) {
    handleError(error);
  }
}
