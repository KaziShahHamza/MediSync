// server/services/bloodRequestManagementService.js

// Service responsible for donor searching and blood request management.
// Handles pagination, authorization data retrieval, updates, and deletion.

import Profile from "../../models/Profile.js";

import BloodRequest from "../../models/BloodRequest.js";

import {
  getRequestExpiry,
  normalizeString,
} from "../../utils/blood/bloodRequestHelpers.js";

// Search available blood donors with server-side pagination.
export async function findDonors({
  bloodGroup,
  district,
  upazila,
  compensation,
  page = 1,
  limit = 20,
}) {
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

  if (compensation === "yes") {
    query.bloodDonationCompensation = "500";
  }

  if (compensation === "no") {
    query.bloodDonationCompensation = "none";
  }

  const totalDonors = await Profile.countDocuments(query);

  const totalPages = Math.max(Math.ceil(totalDonors / limit), 1);

  const safePage = Math.min(Math.max(page, 1), totalPages);

  const skip = (safePage - 1) * limit;

  const donors = await Profile.find(query)
    .select(
      "bloodGroup location.district location.upazila bloodDonationContactNumber -_id",
    )
    .sort({
      "location.district": 1,
      "location.upazila": 1,
      bloodGroup: 1,
    })
    .skip(skip)
    .limit(limit)
    .lean();

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

    limit,
  };
}

// Fetch request document with private authorization data.
export async function findRequestForUpdate(id) {
  return BloodRequest.findById(id).select(
    "+managementTokenHash +requesterIpHash +deviceId",
  );
}

// Update and persist modified request fields.
export async function updateRequest(request, body) {
  request.bloodGroup = normalizeString(body.bloodGroup);

  request.bagsNeeded = Number(body.bagsNeeded);

  request.neededWithinDays = Number(body.neededWithinDays);

  request.compensationOffered = body.compensationOffered;

  request.location = {
    district: normalizeString(body.district),

    upazila: normalizeString(body.upazila),
  };

  request.hospital = {
    name: normalizeString(body.hospitalName),

    address: normalizeString(body.hospitalAddress),
  };

  request.contactPhone = normalizeString(body.contactPhone);

  request.requesterName = normalizeString(body.requesterName);

  request.notes = normalizeString(body.notes);

  // Keep expiration anchored to the original request creation time.
  request.expiresAt = getRequestExpiry(
    request.neededWithinDays,
    request.createdAt,
  );

  await request.save();

  return request;
}

// Fetch request record with management token hash for deletion.
export async function findRequestForDelete(id) {
  return BloodRequest.findById(id).select("+managementTokenHash");
}

// Remove a blood request from the database.
export async function deleteRequest(request) {
  await request.deleteOne();
}
