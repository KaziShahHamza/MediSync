// server/routes/blood.routes.js

import express from "express";
import Profile from "../models/Profile.js";

const router = express.Router();

/**
 * GET /api/blood/donors
 *
 * Public donor discovery endpoint.
 *
 * Optional query parameters:
 * - bloodGroup
 * - district
 * - upazila
 * - compensation
 *
 * compensation values:
 * - "yes"  -> donors accepting compensation ("500")
 * - "no"   -> donors not accepting compensation ("none")
 *
 * Only donors with status "yes" or "willingly" are discoverable.
 *
 * Public response contains ONLY:
 * - bloodGroup
 * - location.district
 * - location.upazila
 * - bloodDonationContactNumber
 */
router.get("/donors", async (req, res) => {
  try {
    const {
      bloodGroup,
      district,
      upazila,
      compensation,
    } = req.query;

    const query = {
      bloodDonorStatus: {
        $in: ["yes", "willingly"],
      },
    };

    if (bloodGroup?.trim()) {
      query.bloodGroup = bloodGroup.trim();
    }

    if (district?.trim()) {
      query["location.district"] = district.trim();
    }

    if (upazila?.trim()) {
      query["location.upazila"] = upazila.trim();
    }

    // Match the requester's compensation preference
    // with the donor's stored compensation value.
    if (compensation === "yes") {
      query.bloodDonationCompensation = "500";
    }

    if (compensation === "no") {
      query.bloodDonationCompensation = "none";
    }

    const donors = await Profile.find(query)
      .select(
        "bloodGroup location.district location.upazila bloodDonationContactNumber -_id",
      )
      .lean();

    const publicDonors = donors.map((donor) => ({
      bloodGroup: donor.bloodGroup || "",
      district: donor.location?.district || "",
      upazila: donor.location?.upazila || "",
      bloodDonationContactNumber:
        donor.bloodDonationContactNumber || "",
    }));

    res.json({
      donors: publicDonors,
    });
  } catch (err) {
    console.error("Failed to fetch blood donors:", err);

    res.status(500).json({
      message: "Failed to fetch blood donors",
    });
  }
});

export default router;

