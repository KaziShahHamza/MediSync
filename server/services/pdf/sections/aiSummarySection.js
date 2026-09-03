// server/services/pdf/sections/aiSummarySection.js

import { formatDate } from "../pdfHelpers.js";

import {
  drawSectionHeader,
  PDF_COLORS,
} from "../pdfStyles.js";

export function renderAISummarySection(doc, aiReport) {
  drawSectionHeader(
    doc,
    "Latest Health Summary",
    "AI-generated overview based on the information available in MediSync.",
  );

  if (!aiReport?.summary) {
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(PDF_COLORS.textMuted)
      .text("No AI health summary has been generated yet.");

    doc.moveDown(1);

    return;
  }

  doc
    .font("Helvetica")
    .fontSize(10.5)
    .fillColor(PDF_COLORS.textSecondary)
    .text(aiReport.summary, {
      align: "left",
      lineGap: 4,
    });

  if (aiReport.generatedAt) {
    doc
      .moveDown(0.6)
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(PDF_COLORS.textMuted)
      .text(
        `Generated on ${formatDate(aiReport.generatedAt)}`,
      );
  }

  doc.moveDown(1);
}