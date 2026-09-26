// server/services/emergencyEmailService.js

// Handles emergency email delivery through Gmail.
// Builds email content and returns delivery results.

import transporter from "../utils/emergency/emailTransporter.js";

import { buildEmailContent } from "../utils/emergency/emergencyEmail.js";

// Sends emergency emails to the configured emergency contacts.
export async function sendEmergencyEmails({
  recipients,
  type,
  triggerData,
  userName,
  pronouns,
}) {
  // Validate the required Gmail configuration.
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error(
      "Gmail credentials are not configured in environment variables.",
    );
  }

  // Skip delivery when no email contacts are available.
  if (!recipients || recipients.length === 0) {
    return {
      sent: false,
      recipients: [],
      reason: "No emergency contacts with email addresses were found.",
    };
  }

  const email = buildEmailContent(type, {
    ...triggerData,
    userName,
    pronouns,
  });

  try {
    // Send one email with all contacts hidden in BCC.
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
    console.error("Failed to send emergency email:", error);

    // Return failed delivery information without throwing.
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
