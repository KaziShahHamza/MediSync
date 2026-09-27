// server/utils/pdf/sections/doctorsSection.js

// Renders the user's saved doctors and their contact information.
// Keeps doctor-specific PDF formatting independent from the report service.

import { formatValue, toArray } from "../pdfHelpers.js";

import {
  PDF_COLORS,
  PDF_FONTS,
  addSectionSpacing,
  applyBodyStyle,
  applySectionStyle,
  drawDivider,
} from "../pdfStyles.js";

// Renders the doctors section of the report.
export function renderDoctorsSection(doc, data) {
  const doctors = toArray(data?.doctors);

  if (doctors.length === 0) {
    return;
  }

  addSectionSpacing(doc);

  applySectionStyle(doc);
  doc.text("Doctors");

  doc.moveDown(0.5);

  drawDivider(doc);

  doc.moveDown(0.7);

  doctors.forEach((doctor, index) => {
    renderDoctor(doc, doctor);

    if (index < doctors.length - 1) {
      doc.moveDown(0.5);
      drawDivider(doc);
      doc.moveDown(0.6);
    }
  });
}

// Renders a single doctor entry.
function renderDoctor(doc, doctor) {
  applyBodyStyle(doc);

  doc
    .font("Helvetica-Bold")
    .fontSize(PDF_FONTS.subsection)
    .fillColor(PDF_COLORS.text)
    .text(formatValue(doctor?.name, "Unnamed doctor"));

  doc.moveDown(0.25);

  const fields = [
    ["Specialty", doctor?.specialty],
    ["Hospital", doctor?.hospital],
    ["Phone", doctor?.phone],
    ["Email", doctor?.email],
    ["Address", doctor?.address],
    ["Notes", doctor?.notes],
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
