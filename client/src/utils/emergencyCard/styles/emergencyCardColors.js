// client/src/utils/emergencyCard/styles/emergencyCardColors.js

// Defines the shared emergency-card color palette.
// Keeps visual color values centralized for consistent card styling.

export const EMERGENCY_CARD_COLORS = {
  white: "#ffffff",

  slate900: "#0f172a",
  slate800: "#1e293b",
  slate700: "#334155",
  slate600: "#475569",
  slate500: "#64748b",
  slate400: "#94a3b8",
  slate300: "#cbd5e1",
  slate200: "#e2e8f0",
  slate100: "#f1f5f9",
  slate50: "#f8fafc",

  sky700: "#0369a1",
  sky600: "#0284c7",
  sky500: "#0ea5e9",
  sky200: "#bae6fd",
  sky100: "#e0f2fe",
  sky50: "#f0f9ff",

  red800: "#991b1b",
  red700: "#b91c1c",
  red600: "#dc2626",
  red200: "#fecaca",
  red100: "#fee2e2",
  red50: "#fef2f2",

  green700: "#15803d",
  green100: "#dcfce7",

  amber700: "#b45309",
  amber100: "#fef3c7",
};

export function getColorStyles() {
  const colors = EMERGENCY_CARD_COLORS;

  return `
    :root {
      --card-white: ${colors.white};

      --card-slate-900: ${colors.slate900};
      --card-slate-800: ${colors.slate800};
      --card-slate-700: ${colors.slate700};
      --card-slate-600: ${colors.slate600};
      --card-slate-500: ${colors.slate500};
      --card-slate-400: ${colors.slate400};
      --card-slate-300: ${colors.slate300};
      --card-slate-200: ${colors.slate200};
      --card-slate-100: ${colors.slate100};
      --card-slate-50: ${colors.slate50};

      --card-sky-700: ${colors.sky700};
      --card-sky-600: ${colors.sky600};
      --card-sky-500: ${colors.sky500};
      --card-sky-200: ${colors.sky200};
      --card-sky-100: ${colors.sky100};
      --card-sky-50: ${colors.sky50};

      --card-red-800: ${colors.red800};
      --card-red-700: ${colors.red700};
      --card-red-600: ${colors.red600};
      --card-red-200: ${colors.red200};
      --card-red-100: ${colors.red100};
      --card-red-50: ${colors.red50};

      --card-green-700: ${colors.green700};
      --card-green-100: ${colors.green100};

      --card-amber-700: ${colors.amber700};
      --card-amber-100: ${colors.amber100};
    }
  `;
}