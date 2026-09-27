// client/src/utils/emergencyCard/styles/emergencyCardFonts.js

// Defines the fonts used by the emergency medical card renderer.
// Keeps font-face declarations separate from layout and component styles.

export const EMERGENCY_CARD_FONTS = {
  regular: "Inter",
  bold: "Inter",
};

export function getFontStyles() {
  return `
    @font-face {
      font-family: "${EMERGENCY_CARD_FONTS.regular}";
      src: local("Inter");
      font-weight: 400;
      font-style: normal;
    }

    @font-face {
      font-family: "${EMERGENCY_CARD_FONTS.bold}";
      src: local("Inter");
      font-weight: 600 800;
      font-style: normal;
    }
  `;
}