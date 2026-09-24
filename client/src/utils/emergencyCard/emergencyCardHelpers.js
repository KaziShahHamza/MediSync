// client/src/utils/emergencyCard/emergencyCardHelpers.js

// Provides shared PDF rendering and emergency card HTML helper functions.
// Keeps PDF generation and template construction files focused on their main responsibilities.

import html2canvas from "html2canvas";

import {
  escapeHtml,
  getFullName,
  getLocationParts,
  getProfilePhoto,
} from "./emergencyCardData";

import { buildCardDocument } from "./emergencyCardTemplates";

const CARD_SCALE = 4;

// Creates an isolated off-screen iframe for clean HTML rendering.
export const createIsolatedDocument = () => {
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

// Waits for custom web fonts to completely load.
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

// Ensures all document images finish loading.
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

// Allows the browser layout engine to complete the render cycle.
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

// Renders raw HTML into a canvas inside a hidden iframe.
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

// Adds a rendered card canvas into a jsPDF instance.
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

// Generates HTML markup for a single emergency contact.
export const createContact = (contact) => {
  const name = contact.name || "Not provided";
  const relation = contact.relation || "Emergency Contact";
  const phone = contact.phone || "Not provided";

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

// Generates HTML markup for the user's location.
export const createLocation = (profile) => {
  const { streetAddress, upazila, district } = getLocationParts(profile);

  return `
    <div class="location-box">
      <div class="location-label">
        PRESENT LOCATION
      </div>

      ${
        streetAddress
          ? `
            <div class="location-line">
              <span class="location-value">
                ${escapeHtml(streetAddress)}, ${escapeHtml(upazila)}, ${escapeHtml(district)}
              </span>
            </div>
          `
          : ""
      }

      ${
        !streetAddress && !upazila && !district
          ? `
            <div class="location-value">
              Not provided
            </div>
          `
          : ""
      }
    </div>
  `;
};

// Generates the profile photo or initial fallback.
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
