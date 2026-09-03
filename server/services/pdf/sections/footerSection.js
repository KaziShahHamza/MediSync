// server/services/pdf/sections/footerSection.js

import { PDF_COLORS } from "../pdfStyles.js";

export function renderFooterPage(doc) {
  doc.addPage();

  const centerX = doc.page.width / 2;

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor(PDF_COLORS.primary)
    .text("MediSync", centerX - 50, 330, {
      width: 100,
      align: "center",
    });

  doc
    .moveDown(0.5)
    .font("Helvetica")
    .fontSize(9)
    .fillColor(PDF_COLORS.textMuted)
    .text(
      "Personal Health Platform",
      centerX - 100,
      doc.y,
      {
        width: 200,
        align: "center",
      },
    );

  doc.moveDown(2);

  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor(PDF_COLORS.textLight)
    .text(
      "This report is generated from information stored in MediSync.",
      centerX - 200,
      doc.y,
      {
        width: 400,
        align: "center",
      },
    );

  doc.moveDown(0.4);

  doc.text(
    "It is not a substitute for professional medical advice, diagnosis, or treatment.",
    centerX - 200,
    doc.y,
    {
      width: 400,
      align: "center",
    },
  );
}