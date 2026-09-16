import Profile from "../models/Profile.js";
import User from "../models/User.js";
import EmergencyAlert from "../models/EmergencyAlert.js";

import {
  sendEmergencyEmails,
} from "./emergencyEmailService.js";

const CRITICAL_SYSTOLIC = 180;
const CRITICAL_DIASTOLIC = 120;

const CRITICAL_LOW_GLUCOSE = 3.0;
const CRITICAL_HIGH_GLUCOSE = 22.2;

/**
 * Determine whether a blood pressure reading
 * has reached the critical alert threshold.
 */
function checkBloodPressure(high, low) {
  const systolic = Number(high);
  const diastolic = Number(low);

  if (!Number.isFinite(systolic) || !Number.isFinite(diastolic)) {
    return null;
  }

  if (
    systolic > CRITICAL_SYSTOLIC ||
    diastolic > CRITICAL_DIASTOLIC
  ) {
    return {
      type: "bloodPressure",
      triggerData: {
        high: systolic,
        low: diastolic,
      },
    };
  }

  return null;
}

/**
 * Determine whether a blood glucose reading
 * has reached a critical threshold.
 */
function checkBloodSugar(glucose, glucoseTiming) {
  const value = Number(glucose);

  if (!Number.isFinite(value)) {
    return null;
  }

  if (value < CRITICAL_LOW_GLUCOSE) {
    return {
      type: "bloodSugar",
      triggerData: {
        glucose: value,
        glucoseTiming,
        direction: "low",
      },
    };
  }

  if (value >= CRITICAL_HIGH_GLUCOSE) {
    return {
      type: "bloodSugar",
      triggerData: {
        glucose: value,
        glucoseTiming,
        direction: "high",
      },
    };
  }

  return null;
}

/**
 * Check a newly-created HealthLog for an emergency condition.
 */
export async function checkHealthLogForEmergency(healthLog) {
  let emergency = null;

  if (healthLog.type === "bp") {
    emergency = checkBloodPressure(
      healthLog.High,
      healthLog.Low,
    );
  }

  if (healthLog.type === "diabetes") {
    emergency = checkBloodSugar(
      healthLog.glucose,
      healthLog.glucoseTiming,
    );
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
    console.warn(
      `No profile found for emergency alert user ${healthLog.user}`,
    );

    return {
      triggered: true,
      emailed: false,
      reason: "Profile not found.",
    };
  }

  const contacts = Array.isArray(profile.emergencyContacts)
    ? profile.emergencyContacts
    : [];

  const emailRecipients = contacts
    .map((contact) => contact.email?.trim().toLowerCase())
    .filter(Boolean);

  if (emailRecipients.length === 0) {
    return {
      triggered: true,
      emailed: false,
      reason:
        "No emergency contacts with email addresses were found.",
    };
  }

  const user = await User.findById(healthLog.user)
    .select("name")
    .lean();

  const userName = user?.name?.trim() || "Your contact";

  /*
   * Determine pronouns from the user's profile gender.
   *
   * Male   -> him / his
   * Female -> her / her
   * Other/missing -> them / their
   */
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
    alert = await EmergencyAlert.create({
      user: healthLog.user,
      healthLog: healthLog._id,
      type,
      status: "pending",
      triggerData,
      emailRecipients,
    });
  } catch (error) {
    // If another request created the alert between our
    // findOne() and create(), treat it as a duplicate.
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
    failedMessages.join(" | ") ||
    "Emergency email could not be sent.";

  await alert.save();

  return {
    triggered: true,
    emailed: false,
    alert,
  };
}

export {
  checkBloodPressure,
  checkBloodSugar,
};

