// server/utils/pdf/sections/aiSummarySection.js

// Renders the cached AI-generated health summary when available.
// Keeps AI report presentation separate from the PDF orchestration layer.

import { formatDate, formatValue } from "../pdfHelpers.js";

import {
  PDF_COLORS,
  PDF_FONTS,
  addSectionSpacing,
  applyBodyStyle,
  applySectionStyle,
  drawDivider,
} from "../pdfStyles.js";

// Renders the AI health summary section.
export function renderAISummarySection(doc, data) {
  const aiReport = data?.aiReport || data?.aiSummary;

  if (!aiReport) {
    return;
  }

  const summary =
    typeof aiReport === "string"
      ? aiReport
      : aiReport.summary || aiReport.overview;

  if (!summary) {
    return;
  }

  addSectionSpacing(doc);

  applySectionStyle(doc);
  doc.text("AI Health Summary");

  doc.moveDown(0.5);

  drawDivider(doc);

  doc.moveDown(0.7);

  applyBodyStyle(doc);

  doc.fillColor(PDF_COLORS.text).text(formatValue(summary), {
    lineGap: 3,
  });

  const recommendations = Array.isArray(aiReport?.recommendations)
    ? aiReport.recommendations
    : [];

  if (recommendations.length > 0) {
    doc.moveDown(0.8);

    doc
      .font("Helvetica-Bold")
      .fontSize(PDF_FONTS.subsection)
      .fillColor(PDF_COLORS.text)
      .text("Recommendations");

    doc.moveDown(0.4);

    recommendations.forEach((recommendation) => {
      doc
        .font("Helvetica")
        .fontSize(PDF_FONTS.body)
        .fillColor(PDF_COLORS.secondary)
        .text(`• ${String(recommendation)}`, {
          indent: 10,
          lineGap: 2,
        });

      doc.moveDown(0.2);
    });
  }

  if (aiReport?.updatedAt) {
    doc.moveDown(0.5);

    doc
      .font("Helvetica")
      .fontSize(PDF_FONTS.small)
      .fillColor(PDF_COLORS.muted)
      .text(`Last updated: ${formatDate(aiReport.updatedAt)}`);
  }
}
