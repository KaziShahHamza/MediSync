// server/services/healthService.js

// Handles health log database operations and related processing.
// Runs emergency checks, synchronizes health data with AI data,
// and keeps only the latest 7 health logs per user.

import HealthLog from "../models/HealthLog.js";

import { syncHealthToAIChatData } from "./aiChatDataSyncService.js";
import { checkHealthLogForEmergency } from "./emergencyService.js";

const MAX_HEALTH_LOGS = 7;

// Creates a health log and runs related background processing.
export async function createHealthLog(userId, data) {
  const log = await HealthLog.create({
    ...data,
    user: userId,
  });

  // Keep only the latest 7 health logs for the user.
  const oldLogs = await HealthLog.find({
    user: userId,
  })
    .sort({ createdAt: -1 })
    .skip(MAX_HEALTH_LOGS)
    .select("_id");

  if (oldLogs.length > 0) {
    await HealthLog.deleteMany({
      _id: {
        $in: oldLogs.map((oldLog) => oldLog._id),
      },
      user: userId,
    });
  }

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
