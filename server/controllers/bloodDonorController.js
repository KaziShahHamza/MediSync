import { findDonors } from "../services/bloodRequestService.js";

// ==========================================================
// GET DONORS
// ==========================================================

export async function getDonors(req, res) {
  try {
    const { bloodGroup, district, upazila, compensation } = req.query;

    const donors = await findDonors({
      bloodGroup,
      district,
      upazila,
      compensation,
    });

    return res.json({
      donors,
    });
  } catch (error) {
    console.error("Failed to fetch blood donors:", error);

    return res.status(500).json({
      message: "Failed to fetch blood donors",
    });
  }
}
