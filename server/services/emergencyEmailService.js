// server/services/emergencyEmailService.js

// Sends emergency health alerts through the configured Gmail account.
// Validates recipients, builds alert content, and returns delivery results.

import {
  transporter,
  buildEmailContent,
} from "../utils/emergency/emergencyEmail.js";

// Sends an emergency email to all valid emergency contacts using BCC.
export async function sendEmergencyEmails({
  recipients,
  type,
  triggerData,
  userName,
  pronouns,
}) {
  // Validate the required Gmail configuration before attempting delivery.
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error(
      "Gmail credentials are not configured in environment variables.",
    );
  }

  // Keep only non-empty, unique email addresses from the provided recipients.
  const validRecipients = [
    ...new Set(
      (recipients || [])
        .filter((recipient) => typeof recipient === "string")
        .map((recipient) => recipient.trim())
        .filter(Boolean),
    ),
  ];

  // Skip delivery when no emergency contacts with email addresses are available.
  if (validRecipients.length === 0) {
    return {
      sent: false,
      recipients: [],
      failedRecipients: [],
      results: [],
      reason: "No emergency contacts with email addresses were found.",
    };
  }

  const email = buildEmailContent(type, {
    ...triggerData,
    userName,
    pronouns,
  });

  try {
    // Send one email while keeping all emergency contacts hidden in BCC.
    const info = await transporter.sendMail({
      from: `"${process.env.GMAIL_USER}" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      bcc: validRecipients,
      subject: email.subject,
      text: email.text,
    });

    return {
      sent: true,
      recipients: validRecipients,
      failedRecipients: [],
      results: validRecipients.map((recipient) => ({
        recipient,
        success: true,
        messageId: info.messageId,
      })),
    };
  } catch (error) {
    console.error("Failed to send emergency email:", error);

    // Return delivery failure information without crashing the calling request.
    return {
      sent: false,
      recipients: [],
      failedRecipients: validRecipients,
      results: validRecipients.map((recipient) => ({
        recipient,
        success: false,
        error: error.message,
      })),
    };
  }
}
