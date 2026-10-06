// server/services/bloodRequestService.js

// Service responsible for creating and retrieving blood requests.
// Management operations are handled by bloodRequestManagementService.js.

import crypto from "crypto";

import BloodRequest from "../../models/BloodRequest.js";

import {
  BLOOD_GROUPS,
  getRequestExpiry,
} from "../../utils/blood/bloodRequestHelpers.js";

// Generate a secure random management token for guest requests.
function generateManagementToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Hash management tokens before storing them.
function hashManagementToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// Persist a new blood request document to MongoDB.
export async function createRequest(requestData) {
  let managementToken = null;
  let managementTokenHash = null;

  // Guests receive a management token.
  if (!requestData.user) {
    managementToken = generateManagementToken();

    managementTokenHash = hashManagementToken(managementToken);
  }

  // Use one timestamp as the creation/expiration anchor.
  const createdAt = new Date();

  const request = await BloodRequest.create({
    ...requestData,

    createdAt,

    managementTokenHash,

    expiresAt: getRequestExpiry(requestData.neededWithinDays, createdAt),
  });

  return {
    request,
    managementToken,
  };
}

// Locate recent posts created within the cooldown window.
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

// Count active unexpired requests for a specific user.
export async function countUserActiveRequests(userId) {
  return BloodRequest.countDocuments({
    user: userId,
    expiresAt: {
      $gt: new Date(),
    },
  });
}

// Query all active unexpired blood requests with optional filters.
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
      "_id bloodGroup bagsNeeded neededWithinDays compensationOffered location hospital contactPhone requesterName notes createdAt expiresAt user",
    )
    .sort({
      createdAt: -1,
    })
    .lean();
}
