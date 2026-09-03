import { PDF_COLORS } from "../pdfStyles.js";

export function renderFooterPage(doc) {
  doc.addPage();

  const centerX = doc.page.width / 2;
  const startY = doc.page.height / 2 - 50;

  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .fillColor(PDF_COLORS.primary)
    .text("MediSync", centerX - 100, startY, {
      width: 200,
      align: "center",
    });

  doc
    .moveDown(0.3)
    .font("Helvetica")
    .fontSize(12)
    .fillColor(PDF_COLORS.textMuted)
    .text("Personal Health Platform", centerX - 100, doc.y, {
      width: 200,
      align: "center",
    });

  doc.moveDown(2);

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor(PDF_COLORS.textLight)
    .text(
      "This report is generated from information stored in MediSync.",
      centerX - 200,
      doc.y,
      {
        width: 400,
        align: "center",
      }
    );

  doc.moveDown(0.3);

  doc.text(
    "It is not a substitute for professional medical advice, diagnosis, or treatment.",
    centerX - 200,
    doc.y,
    {
      width: 400,
      align: "center",
    }
  );
}