// server/services/healthService.js

// Handles health log database operations and related processing.
// Runs emergency checks and synchronizes health data with AI data.

import HealthLog from "../models/HealthLog.js";

import { syncHealthToAIChatData } from "./aiChatDataService.js";
import { checkHealthLogForEmergency } from "./emergencyService.js";

// Creates a health log and runs related background processing.
export async function createHealthLog(userId, data) {
  const log = await HealthLog.create({
    ...data,
    user: userId,
  });

  // Emergency processing must never fail the health measurement.
  try {
    await checkHealthLogForEmergency(log);
  } catch (error) {
    console.error("Failed to process health emergency:", error);
  }

  // AI synchronization must never fail the health measurement.
  try {
    await syncHealthToAIChatData(userId);
  } catch (error) {
    console.error("Failed to sync health to AI chat data:", error);
  }

  return log;
}

// Retrieves health logs ordered by creation time.
export async function getHealthLogs(userId) {
  return HealthLog.find({
    user: userId,
  }).sort({ createdAt: 1 });
}

// Deletes a health log belonging to the authenticated user.
export async function deleteHealthLog(userId, logId) {
  await HealthLog.findOneAndDelete({
    _id: logId,
    user: userId,
  });

  // Keep AI chat data synchronized after deletion.
  try {
    await syncHealthToAIChatData(userId);
  } catch (error) {
    console.error("Failed to sync health to AI chat data:", error);
  }
}
