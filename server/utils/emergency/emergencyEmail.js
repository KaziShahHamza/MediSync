// server/utils/emergency/emergencyEmail.js

// Builds emergency email content for supported alert types.
// Keeps email formatting separate from email delivery logic.

const timingLabels = {
  fasting: "Fasting",
  random: "Random",
  postMeal: "2 hours after meal",
};

// Builds the blood pressure emergency email.
function buildBloodPressureEmail({ high, low, userName, pronouns }) {
  return {
    subject: `${userName}'s - Health Status`,

    text: `Please contact ${userName}.

${pronouns.possessive} blood pressure is very high:
${high}/${low} mmHg

Please check on ${pronouns.object} and help ${pronouns.object} get medical care if needed.`,
  };
}

// Builds the blood sugar emergency email.
function buildBloodSugarEmail({
  glucose,
  glucoseTiming,
  direction,
  userName,
  pronouns,
}) {
  const timing = timingLabels[glucoseTiming] || "Blood glucose";

  const level = direction === "low" ? "very low" : "very high";

  return {
    subject: `${userName}'s - Health Status`,

    text: `Please contact ${userName}.

    ${pronouns.possessive} blood sugar is ${level}:
    ${glucose} mmol/L

    Measurement Type: ${timing}

    Please check on ${pronouns.object} and help ${pronouns.object} get medical care if needed.`,
  };
}

// Builds email content according to emergency type.
export function buildEmailContent(type, triggerData) {
  if (type === "bloodPressure") {
    return buildBloodPressureEmail(triggerData);
  }

  if (type === "bloodSugar") {
    return buildBloodSugarEmail(triggerData);
  }

  throw new Error(`Unsupported emergency email type: ${type}`);
}
