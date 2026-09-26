// client/src/utils/emergencyCard/emergencyCardPdf.js

// Generates the printable A4 emergency medical card PDF.
// Renders both card sides, positions them on A4, and adds print guides.

import { jsPDF } from "jspdf";

import { splitEmergencyContacts } from "./emergencyCardData";
import { buildFrontHtml, buildBackHtml } from "./emergencyCardTemplates";
import { addCardToPdf, renderCard } from "./emergencyCardHelpers";

const CARD_WIDTH_MM = 85.6;
const CARD_HEIGHT_MM = 53.98;
const A4_WIDTH_MM = 210;

// Generates and downloads the emergency medical card PDF.
export async function generateEmergencyCardPdf(profile, userInfo) {
  if (!profile && !userInfo) {
    throw new Error("Profile information is unavailable.");
  }

  const { frontContacts, backContacts } = splitEmergencyContacts(profile);

  // Builds the HTML content for both card sides.
  const frontHtml = buildFrontHtml({
    profile,
    userInfo,
    frontContacts,
  });

  const backHtml = buildBackHtml({
    profile,
    backContacts,
  });

  let frontCanvas;
  let backCanvas;

  try {
    // Renders both sides concurrently to reduce PDF generation time.
    [frontCanvas, backCanvas] = await Promise.all([
      renderCard(frontHtml),
      renderCard(backHtml),
    ]);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const cardX = (A4_WIDTH_MM - CARD_WIDTH_MM) / 2;
    const frontY = 55;
    const backY = 155;

    // Places both card sides at their printable A4 positions.
    addCardToPdf(
      pdf,
      frontCanvas,
      cardX,
      frontY,
      CARD_WIDTH_MM,
      CARD_HEIGHT_MM,
    );

    addCardToPdf(pdf, backCanvas, cardX, backY, CARD_WIDTH_MM, CARD_HEIGHT_MM);

    // Draws borders that can be used as cutting guides.
    pdf.setDrawColor(148, 163, 184);
    pdf.setLineWidth(0.2);

    pdf.rect(cardX, frontY, CARD_WIDTH_MM, CARD_HEIGHT_MM);
    pdf.rect(cardX, backY, CARD_WIDTH_MM, CARD_HEIGHT_MM);

    // Adds print instructions and side labels to the page.
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);

    pdf.text(
      "Print at 100% / Actual Size. Do not use Fit to Page.",
      A4_WIDTH_MM / 2,
      25,
      {
        align: "center",
      },
    );

    pdf.text(
      "Cut along the card borders. Use the front and back sides together.",
      A4_WIDTH_MM / 2,
      30,
      {
        align: "center",
      },
    );

    pdf.setFontSize(7);

    pdf.text("Front", cardX, frontY - 3);
    pdf.text("Back", cardX, backY - 3);

    // Saves the completed emergency card PDF.
    pdf.save("medisync-emergency-card.pdf");
  } catch (error) {
    console.error("Emergency card PDF generation failed:", error);
    throw error;
  }
}
