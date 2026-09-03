// server/services/pdf/sections/healthSection.js

import { formatDate } from "../pdfHelpers.js";

import {
  drawMetricCard,
  drawSectionHeader,
  PDF_COLORS,
} from "../pdfStyles.js";

export function renderHealthSection(doc, health) {
  drawSectionHeader(
    doc,
    "Latest Health Records",
    "Most recent measurements available in your health history.",
  );

  const contentWidth =
    doc.page.width -
    doc.page.margins.left -
    doc.page.margins.right;

  const gap = 10;
  const cardWidth = (contentWidth - gap) / 2;
  const cardHeight = 72;

  const metrics = [
    {
      label: "Blood Pressure",
      value: health?.bloodPressure
        ? `${health.bloodPressure.high}/${health.bloodPressure.low} mmHg`
        : "Not recorded",
      detail: health?.bloodPressure?.date
        ? formatDate(health.bloodPressure.date)
        : "No record available",
    },
    {
      label: "Blood Sugar",
      value: health?.diabetes
        ? `${health.diabetes.glucose} mmol/L`
        : "Not recorded",
      detail: health?.diabetes?.date
        ? formatDate(health.diabetes.date)
        : "No record available",
    },
    {
      label: "Weight",
      value: health?.weight
        ? `${health.weight.value} kg`
        : "Not recorded",
      detail: health?.weight?.date
        ? formatDate(health.weight.date)
        : "No record available",
    },
    {
      label: "BMI",
      value: health?.bmi
        ? `${health.bmi.value}`
        : "Not available",
      detail: health?.bmi
        ? health.bmi.category
        : "Requires height and weight",
    },
  ];

  metrics.forEach((metric, index) => {
    const row = Math.floor(index / 2);
    const column = index % 2;

    const x =
      doc.page.margins.left +
      column * (cardWidth + gap);

    const y = doc.y + row * (cardHeight + gap);

    drawMetricCard(doc, {
      x,
      y,
      width: cardWidth,
      height: cardHeight,
      ...metric,
    });
  });

  doc.y +=
    Math.ceil(metrics.length / 2) *
    (cardHeight + gap);

  doc.y += 12;

  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor(PDF_COLORS.textMuted)
    .text(
      "BMI is calculated from the latest available weight and the height stored in your profile.",
    );

  doc.moveDown(1);
}