// server/services/pdf/sections/personalSection.js

import {
  calculateAge,
  formatValue,
} from "../pdfHelpers.js";

import {
  drawSectionHeader,
  PDF_COLORS,
} from "../pdfStyles.js";

export function renderPersonalSection(doc, { user, profile }) {
  drawSectionHeader(
    doc,
    "Personal Information",
    "Basic information associated with this MediSync account.",
  );

  const startY = doc.y;
  const columnGap = 30;
  const columnWidth =
    (doc.page.width -
      doc.page.margins.left -
      doc.page.margins.right -
      columnGap) /
    2;

  const leftX = doc.page.margins.left;
  const rightX = leftX + columnWidth + columnGap;

  const rows = [];

  rows.push([
    "Name",
    formatValue(user?.name),
    "Email",
    formatValue(user?.email),
  ]);

  if (profile) {
    const age = calculateAge(profile.dob);

    const height =
      profile.height?.feet !== null &&
      profile.height?.feet !== undefined
        ? `${profile.height.feet} ft ${profile.height.inches || 0} in`
        : "Not available";

    rows.push([
      "Age",
      age !== null ? `${age} years` : "Not available",
      "Gender",
      formatValue(profile.gender),
    ]);

    rows.push([
      "Height",
      height,
      "Blood Group",
      formatValue(profile.bloodGroup),
    ]);
  }

  rows.forEach((row, index) => {
    const y = startY + index * 42;

    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(PDF_COLORS.textMuted)
      .text(row[0].toUpperCase(), leftX, y, {
        width: columnWidth,
      });

    doc
      .font("Helvetica")
      .fontSize(10.5)
      .fillColor(PDF_COLORS.text)
      .text(row[1], leftX, y + 13, {
        width: columnWidth,
      });

    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(PDF_COLORS.textMuted)
      .text(row[2].toUpperCase(), rightX, y, {
        width: columnWidth,
      });

    doc
      .font("Helvetica")
      .fontSize(10.5)
      .fillColor(PDF_COLORS.text)
      .text(row[3], rightX, y + 13, {
        width: columnWidth,
      });
  });

  doc.y = startY + rows.length * 42 + 8;
}