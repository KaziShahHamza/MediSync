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

export function drawSectionHeader(doc, title, subtitle = null) {
  const leftX = doc.page.margins.left;

  doc
    .font("Helvetica-Bold")
    .fontSize(17)
    .fillColor(PDF_COLORS.text)
    .text(title, leftX, doc.y);

  if (subtitle) {
    doc
      .moveDown(0.2)
      .font("Helvetica")
      .fontSize(12)
      .fillColor(PDF_COLORS.textMuted)
      .text(subtitle, leftX, doc.y);
  }

  doc.moveDown(0.4);

  doc
    .save()
    .strokeColor(PDF_COLORS.border)
    .lineWidth(1)
    .moveTo(leftX, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke()
    .restore();

  doc.moveDown(0.6);
}

export function drawMetricCard(doc, { x, y, width, height, label, value, detail }) {
  doc
    .save()
    .roundedRect(x, y, width, height, 6)
    .fillAndStroke(PDF_COLORS.surfaceMuted, PDF_COLORS.border);

  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor(PDF_COLORS.textMuted)
    .text(label.toUpperCase(), x + 10, y + 8, { width: width - 20 });

  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .fillColor(PDF_COLORS.text)
    .text(String(value), x + 10, y + 22, { width: width - 20 });

  if (detail) {
    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor(PDF_COLORS.textMuted)
      .text(detail, x + 10, y + height - 16, { width: width - 20 });
  }

  doc.restore();
}