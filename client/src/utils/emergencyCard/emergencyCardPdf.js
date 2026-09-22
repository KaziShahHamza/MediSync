// client/src/utils/emergencyCard/emergencyCardPdf.js

// Handles HTML rendering and canvas conversion to generate an A4 PDF document.
// Includes layout, positioning, cutting guides, and font/image loading helpers.

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import { splitEmergencyContacts } from "./emergencyCardData";

import {
  buildFrontHtml,
  buildBackHtml,
  buildCardDocument,
} from "./emergencyCardTemplates";

const CARD_WIDTH_MM = 85.6;
const CARD_HEIGHT_MM = 53.98;

const A4_WIDTH_MM = 210;

const CARD_SCALE = 4;

// Creates isolated off-screen iframe for clean HTML rendering
const createIsolatedDocument = () => {
  const iframe = document.createElement("iframe");

  iframe.setAttribute("aria-hidden", "true");

  iframe.style.position = "fixed";
  iframe.style.left = "-10000px";
  iframe.style.top = "0";

  iframe.style.width = "1000px";
  iframe.style.height = "1000px";

  iframe.style.border = "0";
  iframe.style.opacity = "0";
  iframe.style.pointerEvents = "none";

  document.body.appendChild(iframe);

  const iframeDocument =
    iframe.contentDocument || iframe.contentWindow?.document;

  if (!iframeDocument) {
    iframe.remove();

    throw new Error("Unable to create isolated PDF document.");
  }

  return {
    iframe,
    document: iframeDocument,
  };
};

// Waits for custom web fonts to be completely loaded
const waitForFonts = async (doc) => {
  if (!doc.fonts) {
    return;
  }

  try {
    await doc.fonts.load('400 16px "NotoBengali"');

    await doc.fonts.load('700 16px "NotoBengali"');

    await doc.fonts.ready;
  } catch (error) {
    console.warn("Emergency card fonts could not be fully loaded:", error);
  }
};

// Ensures all document images finish loading
const waitForImages = async (doc) => {
  const images = Array.from(doc.images || []);

  if (!images.length) {
    return;
  }

  await Promise.all(
    images.map(
      (image) =>
        new Promise((resolve) => {
          if (image.complete) {
            resolve();
            return;
          }

          image.addEventListener("load", resolve, { once: true });

          image.addEventListener("error", resolve, { once: true });
        }),
    ),
  );
};

// Allows browser layout engine to complete render cycle
const waitForRender = async (iframe) => {
  const requestAnimationFrame = iframe.contentWindow?.requestAnimationFrame;

  if (!requestAnimationFrame) {
    return;
  }

  await new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
};

// Renders raw HTML string into canvas element inside hidden iframe
const renderCard = async (html) => {
  const { iframe, document: iframeDocument } = createIsolatedDocument();

  try {
    iframeDocument.open();

    iframeDocument.write(buildCardDocument(html));

    iframeDocument.close();

    await new Promise((resolve) => {
      if (iframeDocument.readyState === "complete") {
        resolve();
        return;
      }

      iframe.onload = resolve;
    });

    await waitForFonts(iframeDocument);

    await waitForImages(iframeDocument);

    await waitForRender(iframe);

    const card = iframeDocument.querySelector(".card");

    if (!card) {
      throw new Error("Emergency card element was not created.");
    }

    const canvas = await html2canvas(card, {
      scale: CARD_SCALE,

      backgroundColor: "#ffffff",

      useCORS: true,

      allowTaint: false,

      logging: false,

      imageTimeout: 0,

      windowWidth: card.offsetWidth,

      windowHeight: card.offsetHeight,
    });

    return canvas;
  } finally {
    iframe.remove();
  }
};

// Adds image canvas into jsPDF instance at given coordinates
const addCardToPdf = (pdf, canvas, x, y) => {
  const imageData = canvas.toDataURL("image/png", 1.0);

  pdf.addImage(
    imageData,
    "PNG",
    x,
    y,
    CARD_WIDTH_MM,
    CARD_HEIGHT_MM,
    undefined,
    "FAST",
  );
};

// Main generator function creating downloadable emergency card PDF
export async function generateEmergencyCardPdf(profile, userInfo) {
  if (!profile && !userInfo) {
    throw new Error("Profile information is unavailable.");
  }

  const { frontContacts, backContacts } = splitEmergencyContacts(profile);

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
    // Render front and back card images in parallel
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

    // Position cards on page
    addCardToPdf(pdf, frontCanvas, cardX, frontY);
    addCardToPdf(pdf, backCanvas, cardX, backY);

    // Draw print cutting guidelines
    pdf.setDrawColor(148, 163, 184);

    pdf.setLineWidth(0.2);

    pdf.rect(cardX, frontY, CARD_WIDTH_MM, CARD_HEIGHT_MM);

    pdf.rect(cardX, backY, CARD_WIDTH_MM, CARD_HEIGHT_MM);

    // Add user print instructions text
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

    pdf.save("medisync-emergency-card.pdf");
  } catch (error) {
    console.error("Emergency card PDF generation failed:", error);

    throw error;
  }
}
