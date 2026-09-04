import { calculateAge, formatValue, ensureSpace } from "../pdfHelpers.js";
import { drawSectionHeader, PDF_COLORS } from "../pdfStyles.js";

export function renderPersonalSection(doc, { user, profile }) {
  ensureSpace(doc, 120);

  drawSectionHeader(
    doc,
    "Personal Information",
    "Basic information associated with this MediSync account."
  );

  const columnGap = 20;
  const columnWidth =
    (doc.page.width - doc.page.margins.left - doc.page.margins.right - columnGap) / 2;

  const leftX = doc.page.margins.left;
  const rightX = leftX + columnWidth + columnGap;

  const age = profile ? calculateAge(profile.dob) : null;
  const height =
    profile?.height?.feet !== null && profile?.height?.feet !== undefined
      ? `${profile.height.feet} ft ${profile.height.inches || 0} in`
      : "Not available";

  const items = [
    { label: "NAME", value: formatValue(user?.name) },
    { label: "EMAIL", value: formatValue(user?.email) },
    { label: "AGE", value: age !== null ? `${age} years` : "Not available" },
    { label: "GENDER", value: formatValue(profile?.gender) },
    { label: "HEIGHT", value: height },
    { label: "BLOOD GROUP", value: formatValue(profile?.bloodGroup) },
  ];

  let currentY = doc.y;

  for (let i = 0; i < items.length; i += 2) {
    const itemLeft = items[i];
    const itemRight = items[i + 1];

    // Left Column
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(PDF_COLORS.textMuted)
      .text(itemLeft.label, leftX, currentY);
    
    doc.moveDown(0.2);

    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor(PDF_COLORS.text)
      .text(itemLeft.value, leftX, currentY + 11, { width: columnWidth });

    // Right Column
    if (itemRight) {
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(PDF_COLORS.textMuted)
        .text(itemRight.label, rightX, currentY);

      doc.moveDown(0.2);
      
      doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor(PDF_COLORS.text)
        .text(itemRight.value, rightX, currentY + 11, { width: columnWidth });
    }

    currentY += 34;
  }

  doc.y = currentY + 6;
}