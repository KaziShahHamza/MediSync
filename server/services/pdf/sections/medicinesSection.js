import { formatMonthYear, ensureSpace } from "../pdfHelpers.js";
import { drawSectionHeader, PDF_COLORS } from "../pdfStyles.js";

export function renderMedicinesSection(doc, medicines = []) {
  ensureSpace(doc, 100);

  drawSectionHeader(
    doc,
    "Active Medicines",
    "Medicines currently marked as active in MediSync.",
  );

  if (!medicines.length) {
    doc
      .font("Helvetica")
      .fontSize(12)
      .fillColor(PDF_COLORS.textMuted)
      .text("No active medicines recorded.");

    doc.moveDown(1);
    return;
  }

  medicines.forEach((medicine, index) => {
    ensureSpace(doc, 55);

    const schedule =
      medicine.dosageTimes?.length > 0
        ? medicine.dosageTimes.join(", ")
        : "No schedule";

    const startMonth = formatMonthYear(medicine.startDate);

    const x = doc.page.margins.left;
    const width =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const y = doc.y;

    doc
      .save()
      .roundedRect(x, y, width, 50, 6)
      .fillAndStroke(PDF_COLORS.surfaceMuted, PDF_COLORS.border)
      .restore();

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor(PDF_COLORS.text)
      .text(
        `${index + 1}. ${medicine.name || "Unnamed Medicine"}`,
        x + 10,
        y + 8,
        {
          width: width - 20,
        },
      );

    doc.moveDown(0.2);

    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor(PDF_COLORS.textSecondary)
      .text(`Time: ${schedule}`, x + 10, y + 22, {
        width: width - 20,
      });

    doc.moveDown(0.2);

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(PDF_COLORS.textMuted)
      .text(`${startMonth} – Present`, x + 10, y + 35);

    doc.y = y + 58;
  });

  doc.moveDown(0.5);
}
