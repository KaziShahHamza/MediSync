// server/utils/emergency/emergencyEmail.js

// Builds emergency email subjects and messages for critical health alerts.

const timingLabels = {
  fasting: "Fasting",
  random: "Random",
  postMeal: "2 hours after meal",
};

// Builds the email content for a critical blood pressure alert.
function buildBloodPressureEmail({ high, low, userName, pronouns }) {
  return {
    subject: `${userName}'s - Health Status`,
    text: `Please contact ${userName}.

${pronouns.possessive} blood pressure is very high:
${high}/${low} mmHg

Please check on ${pronouns.object} and help ${pronouns.object} get medical care if needed.`,
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
