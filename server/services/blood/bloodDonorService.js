// server/services/blood/bloodDonorService.js

// Handles database queries to locate active blood donors.
// Filters donors based on location, blood group, and compensation status.

import Profile from "../../models/Profile.js";

// Query donor profiles from database matching search criteria
export async function findDonors({
  bloodGroup,
  district,
  upazila,
  compensation,
}) {
  // Base query filters for active donors
  const query = {
    bloodDonorStatus: {
      $in: ["yes", "willingly"],
    },
  };

  // Append optional search filters
  if (bloodGroup?.trim()) {
    query.bloodGroup = bloodGroup.trim();
  }

  if (district?.trim()) {
    query["location.district"] = district.trim();
  }

  if (upazila?.trim()) {
    query["location.upazila"] = upazila.trim();
  }

  if (compensation === "yes") {
    query.bloodDonationCompensation = "500";
  }

  if (compensation === "no") {
    query.bloodDonationCompensation = "none";
  }

  // Retrieve matching donor records
  const donors = await Profile.find(query)
    .select(
      "bloodGroup location.district location.upazila bloodDonationContactNumber -_id",
    )
    .lean();

  // Normalize returned donor fields
  return donors.map((donor) => ({
    bloodGroup: donor.bloodGroup || "",

    district: donor.location?.district || "",

    upazila: donor.location?.upazila || "",

    bloodDonationContactNumber: donor.bloodDonationContactNumber || "",
  }));
}
