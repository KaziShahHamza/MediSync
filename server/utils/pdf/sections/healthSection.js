// server/utils/pdf/sections/healthSection.js

// Renders the latest BMI, blood pressure, and blood sugar records.
// Reads the existing health report data without duplicating health calculations.

import { formatDate, formatValue } from "../pdfHelpers.js";

import {
  PDF_COLORS,
  PDF_FONTS,
  addSectionSpacing,
  applyBodyStyle,
  applySectionStyle,
  drawDivider,
} from "../pdfStyles.js";

// Renders the latest health measurements section.
export function renderHealthSection(doc, data) {
  const health = data?.health || {};

  const hasHealthData =
    health.bmi ||
    health.bp ||
    health.bloodPressure ||
    health.diabetes ||
    health.bloodSugar;

  if (!hasHealthData) {
    return;
  }

  addSectionSpacing(doc);

  applySectionStyle(doc);
  doc.text("Latest Health Records");

  doc.moveDown(0.5);

  drawDivider(doc);

  doc.moveDown(0.7);

  applyBodyStyle(doc);

  renderBMI(doc, health);
  renderBloodPressure(doc, health);
  renderBloodSugar(doc, health);
}

// Renders the latest BMI value.
function renderBMI(doc, health) {
  const bmi = health.bmi;

  if (!bmi) {
    return;
  }

  const value =
    typeof bmi === "object"
      ? formatValue(bmi.value ?? bmi.bmi)
      : formatValue(bmi);

  const category = typeof bmi === "object" ? formatValue(bmi.category, "") : "";

  const date = typeof bmi === "object" ? formatDate(bmi.date) : "Not available";

  doc.font("Helvetica-Bold").fillColor(PDF_COLORS.text).text("BMI: ", {
    continued: true,
  });

  doc
    .font("Helvetica")
    .fillColor(PDF_COLORS.secondary)
    .text(`${value}${category ? ` (${category})` : ""}`);

  doc
    .font("Helvetica")
    .fontSize(PDF_FONTS.small)
    .fillColor(PDF_COLORS.muted)
    .text(`Date: ${date}`);

  doc.moveDown(0.6);
}

// Renders the latest blood pressure value.
function renderBloodPressure(doc, health) {
  const bloodPressure = health.bp || health.bloodPressure;

  if (!bloodPressure) {
    return;
  }

  const systolic =
    typeof bloodPressure === "object"
      ? (bloodPressure.systolic ??
        bloodPressure.high ??
        bloodPressure.value?.systolic)
      : null;

  const diastolic =
    typeof bloodPressure === "object"
      ? (bloodPressure.diastolic ??
        bloodPressure.low ??
        bloodPressure.value?.diastolic)
      : null;

  const date = typeof bloodPressure === "object" ? bloodPressure.date : null;

  const reading =
    systolic !== null && diastolic !== null
      ? `${systolic}/${diastolic} mmHg`
      : formatValue(bloodPressure);

  doc
    .font("Helvetica-Bold")
    .fontSize(PDF_FONTS.body)
    .fillColor(PDF_COLORS.text)
    .text("Blood Pressure: ", {
      continued: true,
    });

  doc.font("Helvetica").fillColor(PDF_COLORS.secondary).text(reading);

  if (date) {
    doc
      .fontSize(PDF_FONTS.small)
      .fillColor(PDF_COLORS.muted)
      .text(`Date: ${formatDate(date)}`);
  }

  doc.moveDown(0.6);
}

// Renders the latest blood sugar measurements.
function renderBloodSugar(doc, health) {
  const diabetes = health.diabetes || health.bloodSugar;

  if (!diabetes) {
    return;
  }

  doc
    .font("Helvetica-Bold")
    .fontSize(PDF_FONTS.body)
    .fillColor(PDF_COLORS.text)
    .text("Blood Sugar");

  doc.moveDown(0.3);

  const measurements = [
    ["Fasting", diabetes.fasting],
    ["Post Meal", diabetes.postMeal],
    ["Random", diabetes.random],
  ];

  measurements.forEach(([label, measurement]) => {
    if (!measurement) {
      return;
    }

    const value =
      typeof measurement === "object"
        ? (measurement.glucose ?? measurement.value)
        : measurement;

    const date = typeof measurement === "object" ? measurement.date : null;

    doc
      .font("Helvetica")
      .fontSize(PDF_FONTS.body)
      .fillColor(PDF_COLORS.secondary)
      .text(
        `${label}: ${formatValue(value)} mmol/L${
          date ? ` — ${formatDate(date)}` : ""
        }`,
      );
  });

  doc.moveDown(0.5);
}
