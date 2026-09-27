// client/src/utils/emergencyCard/styles/emergencyCardLayout.js

// Defines emergency-card dimensions, spacing, positioning, and reusable layout rules.
// Keeps structural styling separate from colors, fonts, and content-specific styles.

export const EMERGENCY_CARD_LAYOUT = {
  width: "1050px",
  height: "600px",
  borderRadius: "28px",
  padding: "42px",
  sectionGap: "24px",
  gridGap: "16px",
};

export function getLayoutStyles() {
  const layout = EMERGENCY_CARD_LAYOUT;

  return `
    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      width: 100%;
      min-height: 100%;
    }

    body {
      font-family: "Inter", Arial, sans-serif;
      background: var(--card-white);
      color: var(--card-slate-900);
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }

    .card {
      position: relative;
      width: ${layout.width};
      height: ${layout.height};
      overflow: hidden;
      border-radius: ${layout.borderRadius};
      background: var(--card-white);
      box-sizing: border-box;
    }

    .front-content,
    .back-content {
      position: relative;
      width: 100%;
      height: 100%;
      padding: ${layout.padding};
      box-sizing: border-box;
    }

    .front-content {
      display: flex;
      flex-direction: column;
    }

    .back-content {
      display: flex;
      flex-direction: column;
    }

    .top-strip {
      width: 100%;
      height: 10px;
      margin-bottom: 28px;
      border-radius: 999px;
      background: var(--card-sky-600);
    }

    .content-section {
      margin-bottom: ${layout.sectionGap};
    }

    .two-column {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: ${layout.gridGap};
    }

    .three-column {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: ${layout.gridGap};
    }

    .medical-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: ${layout.gridGap};
    }

    .contact-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: ${layout.gridGap};
    }

    .footer {
      margin-top: auto;
    }
  `;
}
