// server/services/pdfService.js

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

  /*
   * Brand accent.
   */

  doc.roundedRect(x, 50, 6, 46, 3).fill(PDF_COLORS.primary);

  /*
   * Main title.
   */

  doc
    .font("Helvetica-Bold")
    .fontSize(23)
    .fillColor(PDF_COLORS.text)
    .text("MediSync", x + 16, 50);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(PDF_COLORS.textMuted)
    .text("Personal Health Report", x + 17, 78);

  /*
   * Generated timestamp.
   */

  const rightX = doc.page.width - doc.page.margins.right - 170;

  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor(PDF_COLORS.textMuted)
    .text("REPORT GENERATED", rightX, 54, {
      width: 170,
      align: "right",
    });

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(PDF_COLORS.textSecondary)
    .text(formatExportDateTime(), rightX, 69, {
      width: 170,
      align: "right",
    });

  /*
   * Header separator.
   */

  doc
    .moveTo(doc.page.margins.left, 112)
    .lineTo(doc.page.width - doc.page.margins.right, 112)
    .strokeColor(PDF_COLORS.border)
    .lineWidth(1)
    .stroke();

  doc.y = 132;
}

function renderPageNumber(doc) {
  const pageNumber = doc.bufferedPageRange().count;

  const footerY = doc.page.height - 28;

  doc
    .font("Helvetica")
    .fontSize(7.5)
    .fillColor(PDF_COLORS.textLight)
    .text(
      `MediSync Health Report  •  Page ${pageNumber}`,
      doc.page.margins.left,
      footerY,
      {
        width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
        align: "center",
      },
    );
}

function renderPageNumbers(doc) {
  const range = doc.bufferedPageRange();

  for (let index = range.start; index < range.start + range.count; index++) {
    doc.switchToPage(index);

    renderPageNumber(doc);
  }

  doc.switchToPage(range.start + range.count - 1);
}

export async function generateHealthReport(res, data) {
  const doc = new PDFDocument({
    size: "A4",
    margins: {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50,
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

  const { user, profile, health, medicines, doctors, prescriptions, aiReport } =
    data;

  /*
   * ==========================================
   * REPORT HEADER
   * ==========================================
   */

  renderDocumentHeader(doc);

  /*
   * ==========================================
   * PERSONAL INFORMATION
   * ==========================================
   */

  renderPersonalSection(doc, {
    user,
    profile,
  });

  /*
   * ==========================================
   * AI SUMMARY
   * ==========================================
   */

  renderAISummarySection(doc, aiReport);

  /*
   * ==========================================
   * HEALTH
   * ==========================================
   */

  renderHealthSection(doc, health);

  /*
   * ==========================================
   * MEDICINES
   * ==========================================
   */

  renderMedicinesSection(doc, medicines);

  /*
   * ==========================================
   * DOCTORS
   * ==========================================
   */

  renderDoctorsSection(doc, doctors);

  /*
   * ==========================================
   * PRESCRIPTIONS
   * ==========================================
   */

  await renderPrescriptionsSection(doc, prescriptions);

  /*
   * ==========================================
   * FINAL PAGE
   * ==========================================
   */

  renderFooterPage(doc);

  /*
   * ==========================================
   * PAGE NUMBERS
   * ==========================================
   */

  renderPageNumbers(doc);

  /*
   * ==========================================
   * FINISH
   * ==========================================
   */

  doc.end();
}
