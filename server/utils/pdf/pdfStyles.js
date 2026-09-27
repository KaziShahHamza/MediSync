// server/utils/pdf/pdfStyles.js

// Centralizes PDF colors, typography, spacing, and layout constants.
// Keeps the visual style consistent across every generated report section.

export const PDF_COLORS = {
  primary: "#0f6ea8",
  secondary: "#475569",
  text: "#1e293b",
  muted: "#64748b",
  border: "#cbd5e1",
  lightBackground: "#f8fafc",
  white: "#ffffff",
};

export const PDF_LAYOUT = {
  pageWidth: 595.28,
  pageHeight: 841.89,
  margin: 50,
  contentWidth: 495.28,
};

export const PDF_FONTS = {
  title: 20,
  section: 14,
  subsection: 11,
  body: 10,
  small: 8,
  footer: 8,
};

export const PDF_SPACING = {
  section: 18,
  subsection: 10,
  row: 5,
  paragraph: 7,
};

// Applies the standard PDF body text style.
export function applyBodyStyle(doc) {
  doc.font("Helvetica").fontSize(PDF_FONTS.body).fillColor(PDF_COLORS.text);
}

// Applies the standard PDF section heading style.
export function applySectionStyle(doc) {
  doc
    .font("Helvetica-Bold")
    .fontSize(PDF_FONTS.section)
    .fillColor(PDF_COLORS.primary);
}

// Applies the standard PDF subsection heading style.
export function applySubsectionStyle(doc) {
  doc
    .font("Helvetica-Bold")
    .fontSize(PDF_FONTS.subsection)
    .fillColor(PDF_COLORS.text);
}

// Draws a subtle divider line using the shared PDF color palette.
export function drawDivider(doc) {
  doc
    .strokeColor(PDF_COLORS.border)
    .lineWidth(0.5)
    .moveTo(PDF_LAYOUT.margin, doc.y)
    .lineTo(PDF_LAYOUT.pageWidth - PDF_LAYOUT.margin, doc.y)
    .stroke();
}

// Adds consistent vertical spacing between report sections.
export function addSectionSpacing(doc) {
  doc.moveDown(PDF_SPACING.section / PDF_FONTS.body);
}
