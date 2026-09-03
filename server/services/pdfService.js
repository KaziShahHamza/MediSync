import PDFDocument from "pdfkit";

import { formatExportDateTime } from "./pdf/pdfHelpers.js";
import { PDF_COLORS } from "./pdf/pdfStyles.js";

import { renderPersonalSection } from "./pdf/sections/personalSection.js";
import { renderAISummarySection } from "./pdf/sections/aiSummarySection.js";
import { renderHealthSection } from "./pdf/sections/healthSection.js";
import { renderMedicinesSection } from "./pdf/sections/medicinesSection.js";
import { renderDoctorsSection } from "./pdf/sections/doctorsSection.js";
import { renderPrescriptionsSection } from "./pdf/sections/prescriptionsSection.js";
import { renderFooterPage } from "./pdf/sections/footerSection.js";

function renderDocumentHeader(doc) {
  const x = doc.page.margins.left;

  doc.roundedRect(x, 40, 5, 42, 2.5).fill(PDF_COLORS.primary);

  doc
    .font("Helvetica-Bold")
    .fontSize(23)
    .fillColor(PDF_COLORS.text)
    .text("MediSync", x + 14, 40);

  doc
    .font("Helvetica")
    .fontSize(13)
    .fillColor(PDF_COLORS.textMuted)
    .text("Personal Health Report", x + 15, 66);

  const rightX = doc.page.width - doc.page.margins.right - 170;

  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor(PDF_COLORS.textMuted)
    .text("REPORT GENERATED", rightX, 42, {
      width: 170,
      align: "right",
    });

  doc
    .font("Helvetica")
    .fontSize(12)
    .fillColor(PDF_COLORS.textSecondary)
    .text(formatExportDateTime(), rightX, 55, {
      width: 170,
      align: "right",
    });

  doc
    .moveTo(doc.page.margins.left, 95)
    .lineTo(doc.page.width - doc.page.margins.right, 95)
    .strokeColor(PDF_COLORS.border)
    .lineWidth(1)
    .stroke();

  doc.y = 115;
}

// function renderPageNumbers(doc) {
//   const range = doc.bufferedPageRange();
//   const totalPages = range.count;

//   for (let i = 0; i < totalPages; i++) {
//     doc.switchToPage(i);

//     const footerY = doc.page.height - 30;

//     doc
//       .font("Helvetica")
//       .fontSize(7.5)
//       .fillColor(PDF_COLORS.textLight)
//       .text(
//         `MediSync Health Report  •  Page ${i + 1} of ${totalPages}`,
//         doc.page.margins.left,
//         footerY,
//         {
//           width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
//           align: "center",
//         }
//       );
//   }
// }

export async function generateHealthReport(res, data) {
  const doc = new PDFDocument({
    size: "A4",
    margins: {
      top: 45,
      bottom: 45,
      left: 45,
      right: 45,
    },
    bufferPages: true,
    info: {
      Title: "MediSync Health Report",
      Author: "MediSync",
      Subject: "Personal Health Report",
      Creator: "MediSync",
    },
  });

  doc.on("error", (error) => {
    console.error("PDF generation error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        message: "Failed to generate PDF.",
      });
    }
  });

  doc.pipe(res);

  const { user, profile, health, medicines, doctors, prescriptions, aiReport } = data;

  renderDocumentHeader(doc);
  renderPersonalSection(doc, { user, profile });
  renderAISummarySection(doc, aiReport);
  renderHealthSection(doc, health);
  renderMedicinesSection(doc, medicines);
  renderDoctorsSection(doc, doctors);
  await renderPrescriptionsSection(doc, prescriptions);
  renderFooterPage(doc);

  // Correct footer page loop rendering
  // renderPageNumbers(doc);

  doc.end();
}