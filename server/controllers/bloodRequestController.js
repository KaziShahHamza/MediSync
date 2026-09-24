import {
  createRequest,
  findRecentRequest,
  countUserActiveRequests,
  findActiveRequests,
} from "../services/bloodRequestService.js";

import { validateBloodRequest } from "../utils/bloodRequestValidation.js";

import {
  getClientIp,
  hashValue,
  normalizeString,
  publicRequestData,
} from "../utils/bloodRequestHelpers.js";

import { checkAndUpdateRateLimit } from "../utils/bloodRequestRateLimit.js";

import {
  MAX_ACTIVE_REQUESTS_PER_USER,
  REQUEST_COOLDOWN_MS,
} from "../utils/bloodRequestConstants.js";

import { getOptionalAuthenticatedUser } from "../middlewares/bloodRequestAuth.js";

// ==========================================================
// CREATE BLOOD REQUEST
// ==========================================================

export async function createBloodRequest(req, res) {
  try {
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

    const ip = getClientIp(req);
    const ipHash = hashValue(ip);

    // ------------------------------------------------------
    // Rate limit
    // ------------------------------------------------------

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

    // ------------------------------------------------------
    // Request cooldown
    // ------------------------------------------------------

    const cooldownSince = new Date(Date.now() - REQUEST_COOLDOWN_MS);

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

    // ------------------------------------------------------
    // Optional authentication
    // ------------------------------------------------------

    const authenticatedUserId = getOptionalAuthenticatedUser(req);

    // ------------------------------------------------------
    // Logged-in user active request limit
    // ------------------------------------------------------

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

    // ------------------------------------------------------
    // Create request
    // ------------------------------------------------------

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

    const { request, managementToken } = await createRequest(requestData);

    return res.status(201).json({
      message: "Blood request posted successfully.",

      request: publicRequestData(request),

      // Returned only for public users.
      managementToken,
    });
  } catch (error) {
    console.error("Failed to create blood request:", error);

    return res.status(500).json({
      message: "Failed to create blood request.",
    });
  }
}

// ==========================================================
// GET ACTIVE BLOOD REQUESTS
// ==========================================================

export async function getBloodRequests(req, res) {
  try {
    const { bloodGroup, district, upazila, compensation } = req.query;

    const requests = await findActiveRequests({
      bloodGroup,
      district,
      upazila,
      compensation,
    });

    const publicRequests = requests.map((request) => ({
      ...publicRequestData(request),

      // Only tells the frontend whether
      // the request belongs to an account.
      // User ID is never exposed.
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
