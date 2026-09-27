// server/utils/pdf/sections/reportFooter.js

// Renders the report generation timestamp and medical information disclaimer.
// Keeps final PDF messaging separate from report content sections.

import { formatExportDateTime } from "../pdfHelpers.js";
import { PDF_COLORS, PDF_FONTS } from "../pdfStyles.js";

// Renders the final report footer.
export function renderReportFooter(doc, data) {
  const generatedAt = data?.generatedAt || new Date();

  doc.moveDown(1.5);

  doc
    .strokeColor(PDF_COLORS.border)
    .lineWidth(0.5)
    .moveTo(50, doc.y)
    .lineTo(545, doc.y)
    .stroke();

  doc.moveDown(0.7);

  doc
    .font("Helvetica")
    .fontSize(PDF_FONTS.footer)
    .fillColor(PDF_COLORS.muted)
    .text(`Generated on ${formatExportDateTime(generatedAt)}`, {
      align: "center",
    });

  doc.moveDown(0.3);

  doc
    .font("Helvetica")
    .fontSize(PDF_FONTS.footer)
    .fillColor(PDF_COLORS.muted)
    .text(
      "This report is for personal health record purposes and is not a substitute for professional medical advice.",
      {
        align: "center",
        lineGap: 2,
      },
    );
}
