import axios from "axios";
import { formatDate } from "../pdfHelpers.js";
import { PDF_COLORS } from "../pdfStyles.js";

async function getImageBuffer(imageUrl) {
  if (!imageUrl) return null;

  try {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 20000,
    });
    return Buffer.from(response.data);
  } catch (error) {
    console.error("Failed to download image:", imageUrl, error.message);
    return null;
  }
}

function renderPrescriptionHeader(doc, prescription, index) {
  // doc
  //   .font("Helvetica-Bold")
  //   .fontSize(17)
  //   .fillColor(PDF_COLORS.text)
  //   .text(`Medical Record ${index + 1}`);

  // doc.moveDown(0.2);

  doc
    .font("Helvetica")
    .fontSize(13)
    .fillColor(PDF_COLORS.textSecondary)
    .text(prescription.title || "Medical Record");

  // if (prescription.createdAt) {
  //   doc
  //     .moveDown(0.2)
  //     .font("Helvetica")
  //     .fontSize(8)
  //     .fillColor(PDF_COLORS.textMuted)
  //     .text(`Uploaded: ${formatDate(prescription.createdAt)}`);
  // }

  doc.moveDown(0.2);

  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .strokeColor(PDF_COLORS.border)
    .lineWidth(1.5)
    .stroke();

  doc.moveDown(0.4);
}

function renderPrescriptionSummary(doc, prescription) {
  if (!prescription.aiSummary) return;

  doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .fillColor(PDF_COLORS.text)
    .text("AI Summary");

  doc.moveDown(0.2);

  doc
    .font("Helvetica")
    .fontSize(12)
    .fillColor(PDF_COLORS.textSecondary)
    .text(prescription.aiSummary, {
      lineGap: 2.5,
      width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
    });

  doc.moveDown(0.6);
}

function renderImagePlaceholder(doc, message) {
  const width =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const height = 80;
  const x = doc.page.margins.left;
  const y = doc.y;

  doc
    .save()
    .roundedRect(x, y, width, height, 6)
    .fillAndStroke(PDF_COLORS.surfaceMuted, PDF_COLORS.border)
    .restore();

  doc
    .font("Helvetica")
    .fontSize(12)
    .fillColor(PDF_COLORS.danger)
    .text(message, x + 20, y + 32, {
      width: width - 40,
      align: "center",
    });

  doc.y = y + height + 10;
}

export async function renderPrescriptionsSection(doc, prescriptions = []) {
  if (!prescriptions.length) return;

  for (let index = 0; index < prescriptions.length; index++) {
    const prescription = prescriptions[index];

    doc.addPage();

    renderPrescriptionHeader(doc, prescription, index);
    renderPrescriptionSummary(doc, prescription);

    const imageBuffer = await getImageBuffer(prescription.imageUrl);

    if (!imageBuffer) {
      renderImagePlaceholder(
        doc,
        "Unable to display this medical record image."
      );
      continue;
    }

    try {
      const usableWidth =
        doc.page.width - doc.page.margins.left - doc.page.margins.right;

      const remainingHeight =
        doc.page.height - doc.y - doc.page.margins.bottom - 20;

      const maxWidth = usableWidth;
      const maxHeight = Math.max(150, remainingHeight);

      const y = doc.y;

      doc.image(imageBuffer, doc.page.margins.left, y, {
        fit: [maxWidth, maxHeight],
        align: "center",
        valign: "top",
      });

      doc.y = y + maxHeight + 10;

      // if (prescription.aiAnalyzedAt) {
      //   doc
      //     .font("Helvetica")
      //     .fontSize(8)
      //     .fillColor(PDF_COLORS.textMuted)
      //     .text(
      //       `AI analysis: ${formatDate(prescription.aiAnalyzedAt)}`
      //     );
      // }
    } catch (error) {
      console.error("Failed to insert image:", error);
      renderImagePlaceholder(
        doc,
        "Unable to display this medical record image."
      );
    }
  }
}