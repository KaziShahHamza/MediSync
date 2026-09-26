// server/controllers/healthController.js

// Handles health log HTTP requests and responses.
// Delegates persistence and processing to the health service.

import {
  createHealthLog as createHealthLogService,
  getHealthLogs as getHealthLogsService,
  deleteHealthLog as deleteHealthLogService,
} from "../services/healthService.js";

// Creates a new health log for the authenticated user.
export async function createHealthLog(req, res) {
  try {
    const { type, recordedAt } = req.body;

    // Validate the required diabetes measurement date.
    if (type === "diabetes") {
      if (!recordedAt) {
        return res.status(400).json({
          message: "Blood sugar measurement date is required.",
        });
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(recordedAt)) {
        return res.status(400).json({
          message: "Invalid blood sugar measurement date.",
        });
      }
    }

    const log = await createHealthLogService(req.userId, req.body);

    return res.json(log);
  } catch (err) {
    // Preserve the existing health log error response.
    return res.status(400).json({
      message: err.message,
    });
  }
}

// Retrieves all health logs for the authenticated user.
export async function getHealthLogs(req, res) {
  const logs = await getHealthLogsService(req.userId);

  return res.json(logs);
}

// Deletes a health log for the authenticated user.
export async function deleteHealthLog(req, res) {
  await deleteHealthLogService(req.userId, req.params.id);

  return res.json({ success: true });
}
