// server/utils/emergency/emailTransporter.js

// Initializes the Gmail SMTP transporter.
// Keeps external email client configuration outside the service.

import nodemailer from "nodemailer";

// Create the shared Gmail email transporter.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Export the configured transporter.
export default transporter;
