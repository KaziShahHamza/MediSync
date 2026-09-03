import { formatDate, ensureSpace } from "../pdfHelpers.js";
import { drawSectionHeader, PDF_COLORS } from "../pdfStyles.js";

export function renderAISummarySection(doc, aiReport) {
  ensureSpace(doc, 100);

  drawSectionHeader(
    doc,
    "Latest Health Summary",
    "AI-generated overview based on the information available in MediSync."
  );

  const leftX = doc.page.margins.left;
  const usableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  if (!aiReport?.summary) {
    doc
      .font("Helvetica")
      .fontSize(13)
      .fillColor(PDF_COLORS.textMuted)
      .text("No AI health summary has been generated yet.", leftX, doc.y);
    doc.moveDown(1);
    return;
  }

  doc
    .font("Helvetica")
    .fontSize(13)
    .fillColor(PDF_COLORS.textSecondary)
    .text(aiReport.summary, leftX, doc.y, {
      align: "left",
      lineGap: 3,
      width: usableWidth,
    });

  if (aiReport.generatedAt) {
    doc
      .moveDown(0.5)
      .font("Helvetica")
      .fontSize(11)
      .fillColor(PDF_COLORS.textMuted)
      .text(`Generated on ${formatDate(aiReport.generatedAt)}`, leftX, doc.y);
  }

  doc.moveDown(1);
}