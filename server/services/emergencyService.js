// server/services/emergencyService.js

// Coordinates emergency detection, alert persistence, and notifications.
// Loads user information and sends alerts for critical health readings.

import Profile from "../models/Profile.js";
import User from "../models/User.js";
import EmergencyAlert from "../models/EmergencyAlert.js";

import {
  checkBloodPressure,
  checkBloodSugar,
} from "../utils/emergency/emergencyChecks.js";

import { sendEmergencyEmails } from "./emergencyEmailService.js";

// Checks a newly-created health log for an emergency condition.
export async function checkHealthLogForEmergency(healthLog) {
  let emergency = null;

  // Evaluate blood pressure health logs.
  if (healthLog.type === "bp") {
    emergency = checkBloodPressure(healthLog.High, healthLog.Low);
  }

  // Evaluate blood sugar health logs.
  if (healthLog.type === "diabetes") {
    emergency = checkBloodSugar(healthLog.glucose, healthLog.glucoseTiming);
  }

  if (!emergency) {
    return {
      triggered: false,
    };
  }

  const { type, triggerData } = emergency;

  // Prevent duplicate alerts for the same health log.
  const existingAlert = await EmergencyAlert.findOne({
    user: healthLog.user,
    healthLog: healthLog._id,
    type,
  });

  if (existingAlert) {
    return {
      triggered: true,
      duplicate: true,
      alert: existingAlert,
    };
  }

  const profile = await Profile.findOne({
    user: healthLog.user,
  }).lean();

  if (!profile) {
    console.warn(`No profile found for emergency alert user ${healthLog.user}`);

    return {
      triggered: true,
      emailed: false,
      reason: "Profile not found.",
    };
  }

  const contacts = Array.isArray(profile.emergencyContacts)
    ? profile.emergencyContacts
    : [];

  // Extract valid normalized emergency contact emails.
  const emailRecipients = contacts
    .map((contact) => contact.email?.trim().toLowerCase())
    .filter(Boolean);

  if (emailRecipients.length === 0) {
    return {
      triggered: true,
      emailed: false,
      reason: "No emergency contacts with email addresses were found.",
    };
  }

  const user = await User.findById(healthLog.user).select("name").lean();

  const userName = user?.name?.trim() || "Your contact";

  // Determine pronouns from the user's profile gender.
  let pronouns = {
    object: "them",
    possessive: "their",
  };

  if (profile.gender === "Male") {
    pronouns = {
      object: "him",
      possessive: "his",
    };
  } else if (profile.gender === "Female") {
    pronouns = {
      object: "her",
      possessive: "her",
    };
  }

  let alert;

  try {
    // Persist the pending emergency alert before email delivery.
    alert = await EmergencyAlert.create({
      user: healthLog.user,
      healthLog: healthLog._id,
      type,
      status: "pending",
      triggerData,
      emailRecipients,
    });
  } catch (error) {
    // Handle concurrent creation of the same emergency alert.
    if (error.code === 11000) {
      const existing = await EmergencyAlert.findOne({
        user: healthLog.user,
        healthLog: healthLog._id,
        type,
      });

      return {
        triggered: true,
        duplicate: true,
        alert: existing,
      };
    }

    throw error;
  }

  const emailResult = await sendEmergencyEmails({
    recipients: emailRecipients,
    type,
    triggerData,
    userName,
    pronouns,
  });

  const successfulRecipients = emailResult.recipients || [];

  // Mark the alert as sent after successful delivery.
  if (successfulRecipients.length > 0) {
    alert.status = "sent";
    alert.sentAt = new Date();
    alert.emailRecipients = successfulRecipients;
    alert.errorMessage = "";

    await alert.save();

    return {
      triggered: true,
      emailed: true,
      recipients: successfulRecipients,
      alert,
    };
  }

  alert.status = "failed";

  const failedMessages = (emailResult.results || [])
    .filter((result) => !result.success)
    .map((result) => result.error)
    .filter(Boolean);

  alert.errorMessage =
    failedMessages.join(" | ") || "Emergency email could not be sent.";

  await alert.save();

  return {
    triggered: true,
    emailed: false,
    alert,
  };
}

// Preserve the existing named exports for external consumers.
export { checkBloodPressure, checkBloodSugar };
