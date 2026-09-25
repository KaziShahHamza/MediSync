// server/services/bloodRequestService.js

// Service managing CRUD operations for blood donation requests.
// Handles token generation, active listing queries, and request modifications.

import crypto from "crypto";

import Profile from "../../models/Profile.js";
import BloodRequest from "../../models/BloodRequest.js";

import {
  BLOOD_GROUPS,
  REQUEST_LIFETIME_MS,
} from "../../utils/blood/bloodRequestConstants.js";

import { normalizeString } from "../../utils/blood/bloodRequestHelpers.js";

// Generate random management token string
function generateManagementToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Compute SHA-256 hash for raw management token
function hashManagementToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// Search donor profiles by location and blood group criteria
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

// Persist a new blood request document to MongoDB
export async function createRequest(requestData) {
  let managementToken = null;
  let managementTokenHash = null;

  // Generate tokens for non-authenticated guests
  if (!requestData.user) {
    managementToken = generateManagementToken();

    managementTokenHash = hashManagementToken(managementToken);
  }

  const request = await BloodRequest.create({
    ...requestData,

    managementTokenHash,

    expiresAt: new Date(Date.now() + REQUEST_LIFETIME_MS),
  });

  return {
    request,
    managementToken,
  };
}

// Locate recent post created within cooldown window
export async function findRecentRequest({
  requesterIpHash,
  deviceId,
  cooldownSince,
}) {
  return BloodRequest.findOne({
    requesterIpHash,
    deviceId,
    createdAt: {
      $gte: cooldownSince,
    },
  })
    .sort({
      createdAt: -1,
    })
    .lean();
}

// Count active unexpired requests for a specific user ID
export async function countUserActiveRequests(userId) {
  return BloodRequest.countDocuments({
    user: userId,
    expiresAt: {
      $gt: new Date(),
    },
  });
}

// Query all active unexpired blood requests with optional filters
export async function findActiveRequests({
  bloodGroup,
  district,
  upazila,
  compensation,
}) {
  const query = {
    expiresAt: {
      $gt: new Date(),
    },
  };

  if (bloodGroup && BLOOD_GROUPS.includes(bloodGroup.trim())) {
    query.bloodGroup = bloodGroup.trim();
  }

  if (district?.trim()) {
    query["location.district"] = district.trim();
  }

  if (upazila?.trim()) {
    query["location.upazila"] = upazila.trim();
  }

  if (compensation === "yes") {
    query.compensationOffered = true;
  }

  if (compensation === "no") {
    query.compensationOffered = false;
  }

  return BloodRequest.find(query)
    .select(
      "_id bloodGroup bagsNeeded compensationOffered location hospital contactPhone requesterName notes createdAt expiresAt user",
    )
    .sort({
      createdAt: -1,
    })
    .lean();
}

// Retrieve blood request including sensitive authorization fields
export async function findRequestForUpdate(id) {
  return BloodRequest.findById(id).select(
    "+managementTokenHash +requesterIpHash +deviceId",
  );
}

// Save updated request fields back to the database
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

// Fetch request record with token hash for deletion check
export async function findRequestForDelete(id) {
  return BloodRequest.findById(id).select("+managementTokenHash");
}

// Remove blood request document from collection
export async function deleteRequest(request) {
  await request.deleteOne();
}
