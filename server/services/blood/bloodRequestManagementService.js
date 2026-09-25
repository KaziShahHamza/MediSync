// server/services/bloodRequestManagementService.js

// Secondary management service for updating and deleting requests.
// Handles donor querying and document lifecycle operations.

import Profile from "../../models/Profile.js";

import BloodRequest from "../../models/BloodRequest.js";

import { normalizeString } from "../../utils/blood/bloodRequestHelpers.js";

// Search profiles for available blood donors matching parameters
export async function findDonors({
  bloodGroup,
  district,
  upazila,
  compensation,
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

  const donors = await Profile.find(query)
    .select(
      "bloodGroup location.district location.upazila bloodDonationContactNumber -_id",
    )
    .lean();

  return donors.map((donor) => ({
    bloodGroup: donor.bloodGroup || "",

    district: donor.location?.district || "",

    upazila: donor.location?.upazila || "",

    bloodDonationContactNumber: donor.bloodDonationContactNumber || "",
  }));
}

// Fetch request document with auth hashes for update verification
export async function findRequestForUpdate(id) {
  return BloodRequest.findById(id).select(
    "+managementTokenHash +requesterIpHash +deviceId",
  );
}

// Update and persist modified fields on existing request
export async function updateRequest(request, body) {
  request.bloodGroup = normalizeString(body.bloodGroup);

  request.bagsNeeded = Number(body.bagsNeeded);

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

  await request.save();

  return request;
}

// Fetch request document with token hash for delete validation
export async function findRequestForDelete(id) {
  return BloodRequest.findById(id).select("+managementTokenHash");
}

// Remove request document from database
export async function deleteRequest(request) {
  await request.deleteOne();
}
