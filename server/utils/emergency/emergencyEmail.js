// server/utils/emergency/emergencyEmail.js

// Creates the Gmail transporter and builds email content for critical health alerts.
// Keeps email formatting and external mail configuration separate from delivery logic.

import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const timingLabels = {
  fasting: "Fasting",
  random: "Random",
  postMeal: "2 hours after meal",
};

const DEFAULT_PRONOUNS = {
  possessive: "Their",
  object: "them",
};

// Builds the email content for a critical blood pressure alert.
function buildBloodPressureEmail({ high, low, userName, pronouns }) {
  const safePronouns = pronouns || DEFAULT_PRONOUNS;

  return {
    subject: `${userName}'s - Health Status`,
    text: `Please contact ${userName}.

    ${safePronouns.possessive} blood pressure is very high:
    ${high}/${low} mmHg

    Please check on ${safePronouns.object} and help ${safePronouns.object} get medical care if needed.`,
  };
}

// Builds the email content for a critical blood sugar alert.
function buildBloodSugarEmail({
  glucose,
  glucoseTiming,
  direction,
  userName,
  pronouns,
}) {
  const safePronouns = pronouns || DEFAULT_PRONOUNS;
  const timing = timingLabels[glucoseTiming] || "Blood glucose";
  const level = direction === "low" ? "very low" : "very high";

  return {
    subject: `${userName}'s - Health Status`,
    text: `Please contact ${userName}.

    ${safePronouns.possessive} blood sugar is ${level}:
    ${glucose} mmol/L

    Measurement Type: ${timing}

    Please check on ${safePronouns.object} and help ${safePronouns.object} get medical care if needed.`,
  };
}

// Selects the appropriate email builder for the emergency type.
export function buildEmailContent(type, triggerData) {
  if (type === "bloodPressure") {
    return buildBloodPressureEmail(triggerData);
  }

  if (type === "bloodSugar") {
    return buildBloodSugarEmail(triggerData);
  }

  throw new Error(`Unsupported emergency email type: ${type}`);
}
