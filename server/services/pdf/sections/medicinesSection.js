// server/services/pdf/sections/medicinesSection.js

import {
  formatMonthYear,
} from "../pdfHelpers.js";

import {
  drawSectionHeader,
  PDF_COLORS,
} from "../pdfStyles.js";

export function renderMedicinesSection(doc, medicines = []) {
  drawSectionHeader(
    doc,
    "Active Medicines",
    "Medicines currently marked as active in MediSync.",
  );

  if (!medicines.length) {
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(PDF_COLORS.textMuted)
      .text("No active medicines recorded.");

    doc.moveDown(1);

    return;
  }

  medicines.forEach((medicine, index) => {
    const schedule =
      medicine.dosageTimes?.length > 0
        ? medicine.dosageTimes.join(", ")
        : "No schedule";

    const startMonth = formatMonthYear(
      medicine.startDate,
    );

    const x = doc.page.margins.left;
    const width =
      doc.page.width -
      doc.page.margins.left -
      doc.page.margins.right;

    const y = doc.y;

    doc
      .save()
      .roundedRect(x, y, width, 55, 6)
      .fillAndStroke(
        PDF_COLORS.surfaceMuted,
        PDF_COLORS.border,
      )
      .restore();

    doc
      .font("Helvetica-Bold")
      .fontSize(10.5)
      .fillColor(PDF_COLORS.text)
      .text(
        `${index + 1}. ${medicine.name || "Unnamed Medicine"}`,
        x + 12,
        y + 10,
        {
          width: width - 24,
        },
      );

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(PDF_COLORS.textSecondary)
      .text(`Schedule: ${schedule}`, x + 12, y + 26, {
        width: width - 24,
      });

    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(PDF_COLORS.textMuted)
      .text(`${startMonth} – Present`, x + 12, y + 41);

    doc.y = y + 66;
  });
}