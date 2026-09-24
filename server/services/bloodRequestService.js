import crypto from "crypto";

import Profile from "../models/Profile.js";
import BloodRequest from "../models/BloodRequest.js";

import {
  BLOOD_GROUPS,
  REQUEST_LIFETIME_MS,
} from "../utils/bloodRequestConstants.js";

import { normalizeString } from "../utils/bloodRequestHelpers.js";

// ==========================================================
// Management Token Helpers
// ==========================================================

function generateManagementToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashManagementToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// ==========================================================
// Donor Discovery
// ==========================================================

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

// ==========================================================
// Create Blood Request
// ==========================================================

export async function createRequest(requestData) {
  let managementToken = null;
  let managementTokenHash = null;

  // Public requests receive a management token.
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

// ==========================================================
// Find Recent Request
// ==========================================================

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

// ==========================================================
// Count User Active Requests
// ==========================================================

export async function countUserActiveRequests(userId) {
  return BloodRequest.countDocuments({
    user: userId,
    expiresAt: {
      $gt: new Date(),
    },
  });
}

// ==========================================================
// Find Active Blood Requests
// ==========================================================

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

// ==========================================================
// Find Request For Update
// ==========================================================

export async function findRequestForUpdate(id) {
  return BloodRequest.findById(id).select(
    "+managementTokenHash +requesterIpHash +deviceId",
  );
}

// ==========================================================
// Update Blood Request
// ==========================================================

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

// ==========================================================
// Find Request For Delete
// ==========================================================

export async function findRequestForDelete(id) {
  return BloodRequest.findById(id).select("+managementTokenHash");
}

// ==========================================================
// Delete Blood Request
// ==========================================================

export async function deleteRequest(request) {
  await request.deleteOne();
}
