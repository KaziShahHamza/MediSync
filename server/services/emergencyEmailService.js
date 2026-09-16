import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function buildBloodPressureEmail({ high, low }) {
  return {
    subject: "MediSync Blood Pressure",

    text: `This is an automated MediSync health alert.

A blood pressure reading entered in MediSync has reached a critically high level.

Blood pressure:
${high}/${low} mmHg

Please contact the person who listed you as an emergency contact and make sure they are safe.

If they are experiencing concerning symptoms such as chest pain, shortness of breath, back pain, weakness, numbness, vision changes, or difficulty speaking, seek emergency medical care immediately.

This message was generated automatically by MediSync based on the recorded health measurement.

This email is not a medical diagnosis.`,
  };
}

function buildBloodSugarEmail({
  glucose,
  glucoseTiming,
}) {
  const timingLabels = {
    fasting: "Fasting",
    random: "Before Meal / Random",
    postMeal: "2 Hours After Meal",
  };

  const timing =
    timingLabels[glucoseTiming] || "Blood glucose";

  return {
    subject: "MediSync Blood Glucose",

    text: `This is an automated MediSync health alert.

A blood glucose reading entered in MediSync has reached a critically abnormal level.

Blood glucose:
${glucose} mmol/L

Measurement type:
${timing}

Please contact the person who listed you as an emergency contact and make sure they are safe.

If they are confused, unconscious, having seizures, having difficulty breathing, vomiting repeatedly, or otherwise seriously unwell, seek emergency medical care immediately.

This message was generated automatically by MediSync based on the recorded health measurement.

This email is not a medical diagnosis.`,
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
}) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error(
      "Gmail credentials are not configured in environment variables."
    );
  }

  if (!recipients || recipients.length === 0) {
    return {
      sent: false,
      recipients: [],
      reason: "No emergency contacts with email addresses were found.",
    };
  }

  const email = buildEmailContent(type, triggerData);

  const results = [];

  for (const recipient of recipients) {
    try {
      const info = await transporter.sendMail({
        from: `"MediSync " <${process.env.GMAIL_USER}>`,
        to: recipient,
        subject: email.subject,
        text: email.text,
      });

      results.push({
        recipient,
        success: true,
        messageId: info.messageId,
      });
    } catch (error) {
      console.error(
        `Failed to send emergency email to ${recipient}:`,
        error
      );

      results.push({
        recipient,
        success: false,
        error: error.message,
      });
    }
  }

  const successfulRecipients = results
    .filter((result) => result.success)
    .map((result) => result.recipient);

  const failedRecipients = results
    .filter((result) => !result.success)
    .map((result) => result.recipient);

  return {
    sent: successfulRecipients.length > 0,
    recipients: successfulRecipients,
    failedRecipients,
    results,
  };
}