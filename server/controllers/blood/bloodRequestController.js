// server/controllers/blood/bloodRequestController.js

// Handles creation and retrieval of public blood donation requests.
// Enforces rate limits, cooldowns, and user request quotas.

import {
  createRequest,
  findRecentRequest,
  countUserActiveRequests,
  findActiveRequests,
} from "../../services/blood/bloodRequestService.js";

import { validateBloodRequest } from "../../utils/blood/bloodRequestValidation.js";

import {
  getClientIp,
  hashValue,
  normalizeString,
  publicRequestData,
} from "../../utils/blood/bloodRequestHelpers.js";

import { checkAndUpdateRateLimit } from "../../utils/blood/bloodRequestRateLimit.js";

import {
  MAX_ACTIVE_REQUESTS_PER_USER,
  REQUEST_COOLDOWN_MS,
} from "../../utils/blood/bloodRequestConstants.js";

import { getOptionalAuthenticatedUser } from "../../middlewares/bloodRequestAuth.js";

// Handles creation of a new blood request with rate limiting and limits
export async function createBloodRequest(req, res) {
  try {
    // Validate request body fields before processing
    const validationError = validateBloodRequest(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const {
      bloodGroup,
      bagsNeeded,
      compensationOffered,
      district,
      upazila,
      hospitalName,
      hospitalAddress,
      contactPhone,
      requesterName,
      notes,
      deviceId,
    } = req.body;

    const cleanDeviceId =
      typeof deviceId === "string" ? deviceId.trim().slice(0, 100) : "";

    // Extract client IP and generate hash for tracking
    const ip = getClientIp(req);
    const ipHash = hashValue(ip);

    // Verify client has not exceeded daily creation rate limits
    const rateLimitResult = await checkAndUpdateRateLimit({
      ipHash,
      deviceId: cleanDeviceId,
    });

    if (!rateLimitResult.allowed) {
      return res.status(429).json({
        message:
          "You have reached the blood request limit for today. Please try again later.",
      });
    }

    const cooldownSince = new Date(Date.now() - REQUEST_COOLDOWN_MS);

    // Prevent spam by enforcing a cool-down window between requests
    const recentRequest = await findRecentRequest({
      requesterIpHash: ipHash,
      deviceId: cleanDeviceId,
      cooldownSince,
    });

    if (recentRequest) {
      return res.status(429).json({
        message:
          "Please wait a few minutes before posting another blood request.",
      });
    }

    const authenticatedUserId = getOptionalAuthenticatedUser(req);

    // Check maximum active post quota for authenticated account
    if (authenticatedUserId) {
      const activeUserRequests =
        await countUserActiveRequests(authenticatedUserId);

      if (activeUserRequests >= MAX_ACTIVE_REQUESTS_PER_USER) {
        return res.status(429).json({
          message:
            "You already have the maximum number of active blood requests.",
        });
      }
    }

    // Construct standardized request payload
    const requestData = {
      user: authenticatedUserId,

      bloodGroup: normalizeString(bloodGroup),

      bagsNeeded: Number(bagsNeeded),

      compensationOffered,

      location: {
        district: normalizeString(district),

        upazila: normalizeString(upazila),
      },

      hospital: {
        name: normalizeString(hospitalName),

        address: normalizeString(hospitalAddress),
      },

      contactPhone: normalizeString(contactPhone),

      requesterName: normalizeString(requesterName),

      notes: normalizeString(notes),

      requesterIpHash: ipHash,

      deviceId: cleanDeviceId,
    };

    // Save request and retrieve generated guest access token
    const { request, managementToken } = await createRequest(requestData);

    return res.status(201).json({
      message: "Blood request posted successfully.",

      request: publicRequestData(request),

      managementToken,
    });
  } catch (error) {
    console.error("Failed to create blood request:", error);

    return res.status(500).json({
      message: "Failed to create blood request.",
    });
  }
}

// Fetches active blood requests filtered by search parameters
export async function getBloodRequests(req, res) {
  try {
    const { bloodGroup, district, upazila, compensation } = req.query;

    const requests = await findActiveRequests({
      bloodGroup,
      district,
      upazila,
      compensation,
    });

    // Sanitize output data to remove sensitive fields before sending
    const publicRequests = requests.map((request) => ({
      ...publicRequestData(request),

      hasAccount: Boolean(request.user),
    }));

    return res.json({
      requests: publicRequests,
    });
  } catch (error) {
    console.error("Failed to fetch blood requests:", error);

    return res.status(500).json({
      message: "Failed to fetch blood requests.",
    });
  }
}
