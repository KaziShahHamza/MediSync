// server/services/blood/bloodDonorService.js

// Handles database queries to locate active blood donors.
// Filters donors based on location, blood group, compensation status, and pagination.

import Profile from "../../models/Profile.js";

// Query paginated donor profiles matching search criteria.
export async function findDonors({
  bloodGroup,
  district,
  upazila,
  compensation,
  page = 1,
  limit = 20,
}) {
  // Base query filters for active donors.
  const query = {
    bloodDonorStatus: {
      $in: ["yes", "willingly"],
    },
  };

  // Append optional search filters.
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

  // Normalize pagination values before querying MongoDB.
  const currentPage = Math.max(Number.parseInt(page, 10) || 1, 1);

  const pageLimit = Math.min(Math.max(Number.parseInt(limit, 10) || 20, 1), 20);

  const skip = (currentPage - 1) * pageLimit;

  // Count all matching donors for pagination metadata.
  const totalDonors = await Profile.countDocuments(query);

  const totalPages = Math.max(Math.ceil(totalDonors / pageLimit), 1);

  // Prevent requests beyond the final page from querying unnecessary data.
  const safePage = Math.min(currentPage, totalPages);

  const safeSkip = (safePage - 1) * pageLimit;

  // Retrieve only the donors required for the requested page.
  const donors = await Profile.find(query)
    .select(
      "bloodGroup location.district location.upazila bloodDonationContactNumber -_id",
    )
    .sort({
      "location.district": 1,
      "location.upazila": 1,
      bloodGroup: 1,
    })
    .skip(safeSkip)
    .limit(pageLimit)
    .lean();

  // Normalize returned donor fields.
  const normalizedDonors = donors.map((donor) => ({
    bloodGroup: donor.bloodGroup || "",

    district: donor.location?.district || "",

    upazila: donor.location?.upazila || "",

    bloodDonationContactNumber: donor.bloodDonationContactNumber || "",
  }));

  return {
    donors: normalizedDonors,
    currentPage: safePage,
    totalPages,
    totalDonors,
    limit: pageLimit,
  };
}
