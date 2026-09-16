import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function buildBloodPressureEmail({
  high,
  low,
  userName,
  pronouns,
}) {
  return {
    subject: `${userName}'s - Health Status`,

    text: `Please contact ${userName}.

${pronouns.possessive} blood pressure is very high:
${high}/${low} mmHg

Please check on ${pronouns.object} and help ${pronouns.object} get medical care if needed.`,
  };
}

function buildBloodSugarEmail({
  glucose,
  glucoseTiming,
  direction,
  userName,
  pronouns,
}) {
  const timingLabels = {
    fasting: "Fasting",
    random: "Random",
    postMeal: "2 hours after meal",
  };

  const timing =
    timingLabels[glucoseTiming] || "Blood glucose";

  const level =
    direction === "low"
      ? "very low"
      : "very high";

  return {
    subject: `${userName}'s - Health Status`,

    text: `Please contact ${userName}.

${pronouns.possessive} blood sugar is ${level}:
${glucose} mmol/L

Measurement Type: ${timing}

Please check on ${pronouns.object} and help ${pronouns.object} get medical care if needed.`,
  };
}

function buildEmailContent(type, triggerData) {
  if (type === "bloodPressure") {
    return buildBloodPressureEmail(triggerData);
  }

  if (type === "bloodSugar") {
    return buildBloodSugarEmail(triggerData);
  }

  throw new Error(`Unsupported emergency email type: ${type}`);
}

export async function sendEmergencyEmails({
  recipients,
  type,
  triggerData,
  userName,
  pronouns,
}) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error(
      "Gmail credentials are not configured in environment variables.",
    );
  }

  if (!recipients || recipients.length === 0) {
    return {
      sent: false,
      recipients: [],
      reason:
        "No emergency contacts with email addresses were found.",
    };
  }

  const email = buildEmailContent(type, {
    ...triggerData,
    userName,
    pronouns,
  });

  try {
    /*
     * Send ONE email.
     *
     * The Gmail account is the primary recipient.
     * All emergency contacts are hidden in BCC.
     */
    const info = await transporter.sendMail({
      from: `"${process.env.GMAIL_USER}" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      bcc: recipients,
      subject: email.subject,
      text: email.text,
    });

    return {
      sent: true,
      recipients,
      failedRecipients: [],
      results: recipients.map((recipient) => ({
        recipient,
        success: true,
        messageId: info.messageId,
      })),
    };
  } catch (error) {
    console.error(
      "Failed to send emergency email:",
      error,
    );

    return {
      sent: false,
      recipients: [],
      failedRecipients: recipients,
      results: recipients.map((recipient) => ({
        recipient,
        success: false,
        error: error.message,
      })),
    };
  }
}

