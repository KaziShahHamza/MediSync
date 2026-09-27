// server/utils/pdf/sections/prescriptionsSection.js

// Renders prescription records, AI summaries, and available prescription images.
// Downloads images only when a valid remote image URL is available.

import {
  formatDate,
  formatValue,
  getImageBuffer,
  toArray,
} from "../pdfHelpers.js";

import {
  PDF_COLORS,
  PDF_FONTS,
  addSectionSpacing,
  applyBodyStyle,
  applySectionStyle,
  drawDivider,
} from "../pdfStyles.js";

// Renders the prescription section of the report.
export async function renderPrescriptionsSection(doc, data) {
  const prescriptions = toArray(data?.prescriptions);

  if (prescriptions.length === 0) {
    return;
  }

  addSectionSpacing(doc);

  applySectionStyle(doc);
  doc.text("Prescriptions");

  doc.moveDown(0.5);

  drawDivider(doc);

  doc.moveDown(0.7);

  for (const [index, prescription] of prescriptions.entries()) {
    await renderPrescription(doc, prescription);

    if (index < prescriptions.length - 1) {
      doc.addPage();

      applySectionStyle(doc);
      doc.text("Prescriptions");

      doc.moveDown(0.5);

      drawDivider(doc);

      doc.moveDown(0.7);
    }
  }
}

// Renders a single prescription record.
async function renderPrescription(doc, prescription) {
  applyBodyStyle(doc);

  doc
    .font("Helvetica-Bold")
    .fontSize(PDF_FONTS.subsection)
    .fillColor(PDF_COLORS.text)
    .text(formatValue(prescription?.title, "Prescription"));

  doc.moveDown(0.3);

  renderPrescriptionMetadata(doc, prescription);

  if (prescription?.notes) {
    doc.moveDown(0.5);

    doc
      .font("Helvetica-Bold")
      .fontSize(PDF_FONTS.body)
      .fillColor(PDF_COLORS.text)
      .text("Notes");

    doc.moveDown(0.2);

    doc
      .font("Helvetica")
      .fontSize(PDF_FONTS.body)
      .fillColor(PDF_COLORS.secondary)
      .text(String(prescription.notes), {
        lineGap: 2,
      });
  }

  if (prescription?.aiSummary) {
    doc.moveDown(0.6);

    doc
      .font("Helvetica-Bold")
      .fontSize(PDF_FONTS.body)
      .fillColor(PDF_COLORS.text)
      .text("AI Summary");

    doc.moveDown(0.2);

    doc
      .font("Helvetica")
      .fontSize(PDF_FONTS.body)
      .fillColor(PDF_COLORS.secondary)
      .text(String(prescription.aiSummary), {
        lineGap: 2,
      });
  }

  if (prescription?.aiAnalyzedAt) {
    doc.moveDown(0.3);

    doc
      .font("Helvetica")
      .fontSize(PDF_FONTS.small)
      .fillColor(PDF_COLORS.muted)
      .text(`AI analysis date: ${formatDate(prescription.aiAnalyzedAt)}`);
  }

  if (prescription?.imageUrl) {
    await renderPrescriptionImage(doc, prescription.imageUrl);
  }
}

// Renders optional prescription metadata fields.
function renderPrescriptionMetadata(doc, prescription) {
  const fields = [
    ["Date", prescription?.date ? formatDate(prescription.date) : null],
    ["Doctor", prescription?.doctor],
    ["Hospital", prescription?.hospital],
    ["Category", prescription?.category],
  ];

  fields.forEach(([label, value]) => {
    if (value === null || value === undefined || value === "") {
      return;
    }

    doc
      .font("Helvetica")
      .fontSize(PDF_FONTS.body)
      .fillColor(PDF_COLORS.secondary)
      .text(`${label}: ${String(value)}`);
  });
}

// Downloads and renders a prescription image when possible.
async function renderPrescriptionImage(doc, imageUrl) {
  const imageBuffer = await getImageBuffer(imageUrl);

  if (!imageBuffer) {
    doc.moveDown(0.5);

    doc
      .font("Helvetica")
      .fontSize(PDF_FONTS.small)
      .fillColor(PDF_COLORS.muted)
      .text("Prescription image could not be loaded.");

    return;
  }

  doc.moveDown(0.8);

  doc
    .font("Helvetica-Bold")
    .fontSize(PDF_FONTS.body)
    .fillColor(PDF_COLORS.text)
    .text("Prescription Image");

  doc.moveDown(0.4);

  try {
    doc.image(imageBuffer, {
      fit: [495, 500],
      align: "center",
      valign: "center",
    });
  } catch (error) {
    console.error("Failed to render prescription image:", error);

    doc
      .font("Helvetica")
      .fontSize(PDF_FONTS.small)
      .fillColor(PDF_COLORS.muted)
      .text("Prescription image could not be rendered.");
  }
}
