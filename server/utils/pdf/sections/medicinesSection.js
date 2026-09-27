// server/utils/pdf/sections/medicinesSection.js

// Renders active medicines and their dosage schedules.
// Supports the current dosage array structure used by the medicine model.

import { formatDate, formatValue, toArray } from "../pdfHelpers.js";

import {
  PDF_COLORS,
  PDF_FONTS,
  addSectionSpacing,
  applyBodyStyle,
  applySectionStyle,
  drawDivider,
} from "../pdfStyles.js";

// Renders the active medicines section.
export function renderMedicinesSection(doc, data) {
  const medicines = toArray(data?.medicines);

  if (medicines.length === 0) {
    return;
  }

  const activeMedicines = medicines.filter(
    (medicine) => medicine?.isActive !== false,
  );

  if (activeMedicines.length === 0) {
    return;
  }

  addSectionSpacing(doc);

  applySectionStyle(doc);
  doc.text("Active Medicines");

  doc.moveDown(0.5);

  drawDivider(doc);

  doc.moveDown(0.7);

  activeMedicines.forEach((medicine, index) => {
    renderMedicine(doc, medicine);

    if (index < activeMedicines.length - 1) {
      doc.moveDown(0.5);
      drawDivider(doc);
      doc.moveDown(0.6);
    }
  });
}

// Renders a single medicine and its schedule.
function renderMedicine(doc, medicine) {
  applyBodyStyle(doc);

  doc
    .font("Helvetica-Bold")
    .fontSize(PDF_FONTS.subsection)
    .fillColor(PDF_COLORS.text)
    .text(formatValue(medicine?.name, "Unnamed medicine"));

  doc.moveDown(0.25);

  const type = formatValue(medicine?.type, "Not available");

  doc
    .font("Helvetica")
    .fontSize(PDF_FONTS.body)
    .fillColor(PDF_COLORS.secondary)
    .text(`Type: ${type}`);

  const dosage = formatDosage(medicine?.dosage);

  doc.text(`Schedule: ${dosage}`);

  if (medicine?.startDate) {
    doc.text(`Start Date: ${formatDate(medicine.startDate)}`);
  }

  if (medicine?.endDate) {
    doc.text(`End Date: ${formatDate(medicine.endDate)}`);
  }

  doc.moveDown(0.3);
}

// Formats the current dosage array into a readable schedule.
function formatDosage(dosage) {
  if (!Array.isArray(dosage) || dosage.length === 0) {
    return "No schedule";
  }

  return (
    dosage
      .map((item) => {
        if (!item || typeof item !== "object") {
          return null;
        }

        const time = formatDosageTime(item.time);
        const quantity = formatValue(item.quantity, 1);

        return `${time} (${quantity})`;
      })
      .filter(Boolean)
      .join(", ") || "No schedule"
  );
}

// Converts dosage time values into readable labels.
function formatDosageTime(time) {
  const labels = {
    morning: "Morning",
    noon: "Noon",
    night: "Night",
  };

  return labels[time] || formatValue(time);
}
