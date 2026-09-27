// client/src/utils/emergencyCard/styles/emergencyCardStyles.js

// Combines emergency-card fonts, colors, layout, and content-specific styling.
// Exposes one style generator for the emergency-card rendering workflow.

import { getFontStyles } from "./emergencyCardFonts";
import { getColorStyles } from "./emergencyCardColors";
import { getLayoutStyles } from "./emergencyCardLayout";

export function getStyles() {
  return `
    ${getFontStyles()}
    ${getColorStyles()}
    ${getLayoutStyles()}

    .branding {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }

    .brand-title {
      margin: 0;
      color: var(--card-slate-900);
      font-size: 30px;
      font-weight: 800;
      line-height: 1.15;
    }

    .brand-subtitle {
      margin: 6px 0 0;
      color: var(--card-slate-500);
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
    }

    .identity {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      margin-top: 24px;
    }

    .identity-info {
      min-width: 0;
      flex: 1;
    }

    .identity-name {
      margin: 0;
      color: var(--card-slate-900);
      font-size: 34px;
      font-weight: 800;
      line-height: 1.15;
    }

    .identity-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 18px;
      margin-top: 10px;
      color: var(--card-slate-500);
      font-size: 14px;
      font-weight: 500;
    }

    .blood-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      margin-top: 24px;
      padding: 22px 24px;
      border: 1px solid var(--card-red-200);
      border-radius: 20px;
      background: var(--card-red-50);
    }

    .blood-label {
      margin: 0 0 5px;
      color: var(--card-red-700);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .blood-group {
      margin: 0;
      color: var(--card-red-800);
      font-size: 42px;
      font-weight: 800;
      line-height: 1;
    }

    .location {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 22px;
    }

    .location-label {
      color: var(--card-slate-500);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .location-value {
      color: var(--card-slate-800);
      font-size: 15px;
      font-weight: 600;
      line-height: 1.45;
    }

    .section-title {
      margin: 0 0 12px;
      color: var(--card-slate-700);
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .contact {
      padding: 16px 18px;
      border: 1px solid var(--card-slate-200);
      border-radius: 16px;
      background: var(--card-slate-50);
    }

    .contact-label {
      margin: 0 0 5px;
      color: var(--card-slate-500);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .contact-name {
      margin: 0;
      color: var(--card-slate-800);
      font-size: 15px;
      font-weight: 700;
      line-height: 1.3;
    }

    .contact-value {
      margin-top: 5px;
      color: var(--card-slate-600);
      font-size: 13px;
      font-weight: 500;
      line-height: 1.4;
    }

    .back-title {
      margin: 0;
      color: var(--card-slate-900);
      font-size: 28px;
      font-weight: 800;
      line-height: 1.2;
    }

    .back-subtitle {
      margin: 7px 0 0;
      color: var(--card-slate-500);
      font-size: 13px;
      line-height: 1.45;
    }

    .medical-grid {
      margin-top: 24px;
    }

    .medical-item {
      padding: 18px;
      border: 1px solid var(--card-slate-200);
      border-radius: 16px;
      background: var(--card-white);
    }

    .medical-label {
      margin: 0 0 7px;
      color: var(--card-slate-500);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .medical-value {
      margin: 0;
      color: var(--card-slate-800);
      font-size: 14px;
      font-weight: 600;
      line-height: 1.45;
      overflow-wrap: anywhere;
    }

    .emergency-note {
      margin-top: 18px;
      padding: 16px 18px;
      border: 1px solid var(--card-sky-200);
      border-radius: 16px;
      background: var(--card-sky-50);
      color: var(--card-sky-700);
      font-size: 13px;
      font-weight: 500;
      line-height: 1.5;
    }

    .footer {
      padding-top: 18px;
      border-top: 1px solid var(--card-slate-200);
      color: var(--card-slate-400);
      font-size: 11px;
      font-weight: 500;
      line-height: 1.4;
    }

    .muted {
      color: var(--card-slate-500);
    }

    .strong {
      color: var(--card-slate-800);
      font-weight: 700;
    }

    .text-danger {
      color: var(--card-red-700);
    }

    .text-success {
      color: var(--card-green-700);
    }

    .text-warning {
      color: var(--card-amber-700);
    }
  `;
}

export default getStyles;
