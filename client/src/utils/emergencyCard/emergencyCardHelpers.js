// client/src/utils/emergencyCard/emergencyCardHelpers.js

// Provides isolated document rendering, PDF helpers, and card HTML builders.
// Keeps emergency-card rendering operations separate from the export hook.

import html2canvas from "html2canvas";

import {
  escapeHtml,
  getFullName,
  getLocationParts,
  getProfilePhoto,
} from "./emergencyCardData";

import { buildCardDocument } from "./emergencyCardTemplates";

const CARD_SCALE = 4;

// Create an isolated off-screen iframe for card rendering.
export const createIsolatedDocument = () => {
  const iframe = document.createElement("iframe");

  iframe.setAttribute("aria-hidden", "true");

  Object.assign(iframe.style, {
    position: "fixed",
    left: "-10000px",
    top: "0",
    width: "1000px",
    height: "1000px",
    border: "0",
    opacity: "0",
    pointerEvents: "none",
  });

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

// Wait for the emergency-card web fonts to finish loading.
export const waitForFonts = async (doc) => {
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

// Wait for all card images to finish loading.
export const waitForImages = async (doc) => {
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

// Allow the browser to complete the iframe layout cycle.
export const waitForRender = async (iframe) => {
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

// Render emergency-card HTML into a canvas.
export const renderCard = async (html) => {
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

    return await html2canvas(card, {
      scale: CARD_SCALE,
      backgroundColor: "#ffffff",
      useCORS: true,
      allowTaint: false,
      logging: false,
      imageTimeout: 0,
      windowWidth: card.offsetWidth,
      windowHeight: card.offsetHeight,
    });
  } finally {
    iframe.remove();
  }
};

// Add a rendered emergency card canvas to a jsPDF document.
export const addCardToPdf = (pdf, canvas, x, y, cardWidth, cardHeight) => {
  const imageData = canvas.toDataURL("image/png", 1.0);

  pdf.addImage(
    imageData,
    "PNG",
    x,
    y,
    cardWidth,
    cardHeight,
    undefined,
    "FAST",
  );
};

// Build HTML markup for an emergency contact.
export const createContact = (contact) => {
  const name = contact?.name || "Not provided";
  const relation = contact?.relation || "Emergency Contact";
  const phone = contact?.phone || "Not provided";

  return `
    <div class="contact">
      <div class="contact-main">
        <div class="contact-name">
          ${escapeHtml(name)} | ${escapeHtml(relation)}
        </div>
      </div>

      <div class="contact-phone">
        ${escapeHtml(phone)}
      </div>
    </div>
  `;
};

// Build HTML markup for the user's current location.
export const createLocation = (profile) => {
  const { streetAddress, upazila, district } = getLocationParts(profile);

  const hasLocation = streetAddress || upazila || district;

  return `
    <div class="location-box">
      <div class="location-label">
        PRESENT LOCATION
      </div>

      ${
        hasLocation
          ? `
            <div class="location-line">
              <span class="location-value">
                ${escapeHtml(
                  [streetAddress, upazila, district].filter(Boolean).join(", "),
                )}
              </span>
            </div>
          `
          : `
            <div class="location-value">
              Not provided
            </div>
          `
      }
    </div>
  `;
};

// Build HTML markup for the profile photo or initial fallback.
export const createPhoto = (userInfo) => {
  const photoUrl = getProfilePhoto(userInfo);

  if (!photoUrl) {
    return `
      <div class="photo-placeholder">
        ${escapeHtml(getFullName(userInfo).charAt(0).toUpperCase())}
      </div>
    `;
  }

  return `
    <div class="photo-frame">
      <img
        src="${escapeHtml(photoUrl)}"
        alt="Profile photo"
        crossorigin="anonymous"
      />
    </div>
  `;
};
