// server/services/pdf/pdfStyles.js

export const PDF_COLORS = {
  primary: "#2563eb",
  primaryDark: "#1d4ed8",
  primarySoft: "#eff6ff",

  text: "#0f172a",
  textSecondary: "#334155",
  textMuted: "#64748b",
  textLight: "#94a3b8",

  border: "#e2e8f0",
  borderStrong: "#cbd5e1",

  surface: "#ffffff",
  surfaceMuted: "#f8fafc",

  success: "#16a34a",
  warning: "#d97706",
  danger: "#dc2626",
};

export const PDF_LAYOUT = {
  pageMargin: 50,
  headerHeight: 72,

  sectionSpacing: 22,

  prescriptionImageWidthRatio: 0.8,
  prescriptionImageHeightRatio: 0.8,
};

export function applyBodyStyle(doc) {
  doc.font("Helvetica").fontSize(10.5).fillColor(PDF_COLORS.textSecondary);
}

export function applyHeadingStyle(doc) {
  doc.font("Helvetica-Bold").fontSize(15).fillColor(PDF_COLORS.text);
}

export function applySubheadingStyle(doc) {
  doc.font("Helvetica-Bold").fontSize(11).fillColor(PDF_COLORS.text);
}

export function applyMutedStyle(doc) {
  doc.font("Helvetica").fontSize(9).fillColor(PDF_COLORS.textMuted);
}

export function applyLabelStyle(doc) {
  doc.font("Helvetica-Bold").fontSize(10).fillColor(PDF_COLORS.text);
}

export function drawSectionHeader(doc, title, subtitle = null) {
  doc
    .font("Helvetica-Bold")
    .fontSize(15)
    .fillColor(PDF_COLORS.text)
    .text(title);

  if (subtitle) {
    doc
      .moveDown(0.2)
      .font("Helvetica")
      .fontSize(9)
      .fillColor(PDF_COLORS.textMuted)
      .text(subtitle);
  }

  doc.moveDown(0.55);

  doc
    .save()
    .strokeColor(PDF_COLORS.border)
    .lineWidth(1)
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke()
    .restore();

  doc.moveDown(0.7);
}

export function drawMetricCard(
  doc,
  { x, y, width, height, label, value, detail },
) {
  doc
    .save()
    .roundedRect(x, y, width, height, 7)
    .fillAndStroke(PDF_COLORS.surfaceMuted, PDF_COLORS.border);

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(PDF_COLORS.textMuted)
    .text(label.toUpperCase(), x + 12, y + 10, {
      width: width - 24,
    });

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor(PDF_COLORS.text)
    .text(String(value), x + 12, y + 25, {
      width: width - 24,
    });

  if (detail) {
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(PDF_COLORS.textMuted)
      .text(detail, x + 12, y + height - 17, {
        width: width - 24,
      });
  }

  doc.restore();
}
