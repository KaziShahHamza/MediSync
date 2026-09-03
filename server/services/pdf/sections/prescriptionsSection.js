// server/services/pdf/sections/prescriptionsSection.js

import axios from "axios";

import {
  formatDate,
} from "../pdfHelpers.js";

import {
  PDF_COLORS,
} from "../pdfStyles.js";

async function getImageBuffer(imageUrl) {
  if (!imageUrl) {
    return null;
  }

  try {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 20000,
    });

    return Buffer.from(response.data);
  } catch (error) {
    console.error(
      "Failed to download medical record image:",
      imageUrl,
      error.message,
    );

    return null;
  }
}

function renderPrescriptionHeader(doc, prescription, index) {
  doc
    .font("Helvetica-Bold")
    .fontSize(19)
    .fillColor(PDF_COLORS.text)
    .text(`Medical Record ${index + 1}`);

  doc.moveDown(0.3);

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor(PDF_COLORS.textSecondary)
    .text(prescription.title || "Medical Record");

  doc.moveDown(0.35);

  if (prescription.createdAt) {
    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(PDF_COLORS.textMuted)
      .text(`Uploaded: ${formatDate(prescription.createdAt)}`);
  }

  doc.moveDown(0.7);

  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(
      doc.page.width - doc.page.margins.right,
      doc.y,
    )
    .strokeColor(PDF_COLORS.border)
    .lineWidth(1)
    .stroke();

  doc.moveDown(0.8);
}

function renderPrescriptionSummary(doc, prescription) {
  if (!prescription.aiSummary) {
    return;
  }

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(PDF_COLORS.text)
    .text("AI Summary");

  doc.moveDown(0.25);

  doc
    .font("Helvetica")
    .fontSize(9.5)
    .fillColor(PDF_COLORS.textSecondary)
    .text(prescription.aiSummary, {
      lineGap: 3,
      width:
        doc.page.width -
        doc.page.margins.left -
        doc.page.margins.right,
    });

  doc.moveDown(0.8);
}

function renderImagePlaceholder(doc, message) {
  const width =
    doc.page.width -
    doc.page.margins.left -
    doc.page.margins.right;

  const height = 100;
  const x = doc.page.margins.left;
  const y = doc.y;

  doc
    .save()
    .roundedRect(x, y, width, height, 6)
    .fillAndStroke(
      PDF_COLORS.surfaceMuted,
      PDF_COLORS.border,
    )
    .restore();

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(PDF_COLORS.danger)
    .text(message, x + 20, y + 42, {
      width: width - 40,
      align: "center",
    });

  doc.y = y + height + 15;
}

export async function renderPrescriptionsSection(
  doc,
  prescriptions = [],
) {
  if (!prescriptions.length) {
    return;
  }

  for (let index = 0; index < prescriptions.length; index++) {
    const prescription = prescriptions[index];

    // Every medical record gets its own page.
    doc.addPage();

    renderPrescriptionHeader(
      doc,
      prescription,
      index,
    );

    renderPrescriptionSummary(
      doc,
      prescription,
    );

    const imageBuffer = await getImageBuffer(
      prescription.imageUrl,
    );

    if (!imageBuffer) {
      renderImagePlaceholder(
        doc,
        "Unable to display this medical record image.",
      );

      continue;
    }

    try {
      /*
       * A4:
       *
       * 595 x 842 points
       *
       * With 50pt margins:
       *
       * usable width  = 495
       * usable height = 742
       *
       * We use approximately 80% of the usable area.
       */

      const usableWidth =
        doc.page.width -
        doc.page.margins.left -
        doc.page.margins.right;

      const usableHeight =
        doc.page.height -
        doc.page.margins.top -
        doc.page.margins.bottom;

      const maxWidth = usableWidth * 0.8;
      const maxHeight = usableHeight * 0.8;

      /*
       * Center the image horizontally.
       *
       * PDFKit's fit option preserves the original
       * aspect ratio and prevents distortion.
       */

      const x =
        doc.page.margins.left +
        (usableWidth - maxWidth) / 2;

      const remainingHeight =
        doc.page.height -
        doc.y -
        doc.page.margins.bottom;

      const imageHeight = Math.min(
        maxHeight,
        remainingHeight,
      );

      const y = doc.y;

      if (imageHeight < 100) {
        doc.addPage();

        renderPrescriptionHeader(
          doc,
          prescription,
          index,
        );
      }

      const actualRemainingHeight =
        doc.page.height -
        doc.y -
        doc.page.margins.bottom;

      const finalMaxHeight = Math.min(
        maxHeight,
        actualRemainingHeight,
      );

      const finalY = doc.y;

      doc.image(imageBuffer, x, finalY, {
        fit: [maxWidth, finalMaxHeight],
        align: "center",
        valign: "center",
      });

      doc.y = finalY + finalMaxHeight + 15;

      if (prescription.aiAnalyzedAt) {
        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor(PDF_COLORS.textMuted)
          .text(
            `AI analysis: ${formatDate(
              prescription.aiAnalyzedAt,
            )}`,
          );
      }
    } catch (error) {
      console.error(
        "Failed to insert medical record image:",
        error,
      );

      renderImagePlaceholder(
        doc,
        "Unable to display this medical record image.",
      );
    }
  }
}