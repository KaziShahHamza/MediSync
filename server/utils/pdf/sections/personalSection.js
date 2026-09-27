// server/utils/pdf/sections/personalSection.js

// Renders the patient's personal and profile information.
// Uses shared PDF helpers and styles to keep formatting consistent.

import { calculateAge, formatValue, toText } from "../pdfHelpers.js";

import {
  PDF_COLORS,
  PDF_FONTS,
  PDF_LAYOUT,
  applyBodyStyle,
  applySectionStyle,
  drawDivider,
} from "../pdfStyles.js";

// Renders the personal information section of the report.
export function renderPersonalSection(doc, data) {
  const profile = data?.profile || {};
  const user = data?.user || {};

  const name = toText(
    profile.name || user.name || data?.userName,
    "Not available",
  );

  const age = calculateAge(profile.dob);

  // Render the report title and generation date.
  doc
    .font("Helvetica-Bold")
    .fontSize(PDF_FONTS.title)
    .fillColor(PDF_COLORS.primary)
    .text("MediSync Health Report", {
      align: "center",
    });

  doc.moveDown(0.4);

  doc
    .font("Helvetica")
    .fontSize(PDF_FONTS.small)
    .fillColor(PDF_COLORS.muted)
    .text("Personal Health Summary", {
      align: "center",
    });

  doc.moveDown(1.2);

  applySectionStyle(doc);
  doc.text("Personal Information");

  doc.moveDown(0.5);

  drawDivider(doc);

  doc.moveDown(0.7);

  applyBodyStyle(doc);

  const personalRows = [
    ["Name", name],
    [
      "Date of Birth",
      formatValue(
        profile.dob ? new Date(profile.dob).toLocaleDateString("en-US") : null,
      ),
    ],
    ["Age", age !== null ? `${age} years` : "Not available"],
    ["Gender", formatValue(profile.gender)],
    ["Blood Group", formatValue(profile.bloodGroup)],
    ["Height", formatHeight(profile.height)],
    ["Allergies", formatList(profile.allergies)],
    ["Chronic Illnesses", formatList(profile.chronicIllnesses)],
    ["Surgeries", formatList(profile.surgeries)],
  ];

  personalRows.forEach(([label, value]) => {
    renderRow(doc, label, value);
  });

  doc.moveDown(0.7);
}

// Formats profile height when it is stored as feet and inches.
function formatHeight(height) {
  if (!height) {
    return "Not available";
  }

  if (
    height.feet !== null &&
    height.feet !== undefined &&
    height.inches !== null &&
    height.inches !== undefined
  ) {
    return `${height.feet} ft ${height.inches} in`;
  }

  if (height.cm !== null && height.cm !== undefined) {
    return `${height.cm} cm`;
  }

  if (typeof height === "number") {
    return `${height} cm`;
  }

  return "Not available";
}

// Converts profile array values into readable comma-separated text.
function formatList(value) {
  if (Array.isArray(value) && value.length > 0) {
    return value.join(", ");
  }

  return formatValue(value);
}

// Renders a consistent label-value row.
function renderRow(doc, label, value) {
  doc
    .font("Helvetica-Bold")
    .fontSize(PDF_FONTS.body)
    .fillColor(PDF_COLORS.text)
    .text(`${label}: `, {
      continued: true,
      width: 130,
    });

  doc
    .font("Helvetica")
    .fillColor(PDF_COLORS.secondary)
    .text(String(value), {
      width: PDF_LAYOUT.contentWidth - 130,
    });

  doc.moveDown(0.35);
}
