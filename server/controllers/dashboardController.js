// server/controllers/dashboardController.js

// Handles dashboard HTTP requests and returns aggregated dashboard data.

import { getDashboardData } from "../services/dashboardService.js";

// Handle the dashboard data request.
export async function getDashboard(req, res) {
  try {
    // Load dashboard data for the authenticated user.
    const data = await getDashboardData(req.userId);

    return res.json(data);
  } catch (err) {
    // Log unexpected dashboard failures.
    console.error(err);

    return res.status(500).json({
      message: "Failed to load dashboard",
    });
  }
}
