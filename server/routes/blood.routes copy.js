// server/routes/blood.routes.js

import express from "express";
import crypto from "crypto";

import Profile from "../models/Profile.js";
import BloodRequest from "../models/BloodRequest.js";
import BloodRequestRateLimit from "../models/BloodRequestRateLimit.js";

import auth from "../middlewares/auth.js";

const router = express.Router();

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// ==========================================================
// Blood Request Configuration
// ==========================================================
//
// 24 hours timer
//
const REQUEST_LIFETIME_MS = 24 * 60 * 60 * 1000;

const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;

// Maximum requests allowed from the same
// IP/device combination during the 24-hour window.
const MAX_REQUESTS_PER_DAY = 3;

// Maximum active requests owned by one logged-in user.
const MAX_ACTIVE_REQUESTS_PER_USER = 3;

// Short cooldown between requests.
const REQUEST_COOLDOWN_MS = 5 * 60 * 1000;

// ==========================================================
// Helpers
// ==========================================================

function hashValue(value) {
  return crypto
    .createHash("sha256")
    .update(`${value}:${process.env.JWT_SECRET}`)
    .digest("hex");
}

function generateManagementToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashManagementToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return req.socket?.remoteAddress || req.ip || "unknown";
}

function normalizeString(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function isValidBloodGroup(value) {
  return BLOOD_GROUPS.includes(value);
}

function isValidPhone(value) {
  const phone = normalizeString(value);

  // Bangladesh-oriented basic validation.
  // Allows +880..., 01..., spaces, hyphens and parentheses.
  return /^[+]?[\d\s()-]{7,20}$/.test(phone);
}

function getRequestExpiry() {
  return new Date(Date.now() + REQUEST_LIFETIME_MS);
}

function publicRequestData(request) {
  return {
    id: request._id,

    bloodGroup: request.bloodGroup,

    bagsNeeded: request.bagsNeeded,

    compensationOffered: request.compensationOffered,

    district: request.location?.district || "",

    upazila: request.location?.upazila || "",

    hospital: {
      name: request.hospital?.name || "",
      address: request.hospital?.address || "",
    },

    contactPhone: request.contactPhone || "",

    requesterName: request.requesterName || "",

    notes: request.notes || "",

    createdAt: request.createdAt,

    expiresAt: request.expiresAt,
  };
}

// ==========================================================
// Existing Public Donor Discovery
// ==========================================================

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
 */
router.get("/donors", async (req, res) => {
  try {
    const { bloodGroup, district, upazila, compensation } = req.query;

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

    const publicDonors = donors.map((donor) => ({
      bloodGroup: donor.bloodGroup || "",

      district: donor.location?.district || "",

      upazila: donor.location?.upazila || "",

      bloodDonationContactNumber: donor.bloodDonationContactNumber || "",
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

// ==========================================================
// Blood Request Rate Limiting
// ==========================================================

async function checkAndUpdateRateLimit({ ipHash, deviceId }) {
  const now = new Date();

  const key = hashValue(`${ipHash}:${deviceId || "no-device"}`);

  let rateLimit = await BloodRequestRateLimit.findOne({
    key,
  });

  // No existing window.
  if (!rateLimit || rateLimit.expiresAt <= now) {
    rateLimit = await BloodRequestRateLimit.findOneAndUpdate(
      { key },
      {
        $set: {
          count: 1,
          windowStart: now,
          expiresAt: new Date(now.getTime() + RATE_LIMIT_WINDOW_MS),
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    return {
      allowed: true,
      rateLimit,
    };
  }

  if (rateLimit.count >= MAX_REQUESTS_PER_DAY) {
    return {
      allowed: false,
      rateLimit,
    };
  }

  rateLimit.count += 1;
  await rateLimit.save();

  return {
    allowed: true,
    rateLimit,
  };
}

// ==========================================================
// Validate Blood Request
// ==========================================================

function validateBloodRequest(body) {
  const bloodGroup = normalizeString(body.bloodGroup);

  const bagsNeeded = Number(body.bagsNeeded);

  const district = normalizeString(body.district);

  const upazila = normalizeString(body.upazila);

  const hospitalName = normalizeString(body.hospitalName);

  const hospitalAddress = normalizeString(body.hospitalAddress);

  const contactPhone = normalizeString(body.contactPhone);

  const requesterName = normalizeString(body.requesterName);

  const notes = normalizeString(body.notes);

  const compensationOffered = body.compensationOffered;

  if (!isValidBloodGroup(bloodGroup)) {
    return "Please select a valid blood group.";
  }

  if (!Number.isInteger(bagsNeeded) || bagsNeeded < 1 || bagsNeeded > 20) {
    return "Number of bags must be between 1 and 20.";
  }

  if (!district) {
    return "District is required.";
  }

  if (!upazila) {
    return "Upazila is required.";
  }

  if (!hospitalName) {
    return "Hospital name is required.";
  }

  if (!hospitalAddress) {
    return "Hospital address is required.";
  }

  if (!isValidPhone(contactPhone)) {
    return "Please provide a valid contact phone number.";
  }

  if (typeof compensationOffered !== "boolean") {
    return "Please specify whether you will provide travel cost or honorarium.";
  }

  if (requesterName.length > 100) {
    return "Requester name is too long.";
  }

  if (notes.length > 1000) {
    return "Notes are too long.";
  }

  return null;
}

// ==========================================================
// CREATE BLOOD REQUEST
// ==========================================================

/**
 * POST /api/blood/requests
 *
 * Public endpoint.
 *
 * Logged-in users may send:
 * Authorization: Bearer <token>
 *
 * Public users don't need authentication.
 */
router.post("/requests", async (req, res) => {
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
    // Check recent request cooldown
    // ------------------------------------------------------

    const cooldownSince = new Date(Date.now() - REQUEST_COOLDOWN_MS);

    const recentRequest = await BloodRequest.findOne({
      requesterIpHash: ipHash,
      deviceId: cleanDeviceId,
      createdAt: {
        $gte: cooldownSince,
      },
    })
      .sort({ createdAt: -1 })
      .lean();

    if (recentRequest) {
      return res.status(429).json({
        message:
          "Please wait a few minutes before posting another blood request.",
      });
    }

    // ------------------------------------------------------
    // Logged-in user active request limit
    // ------------------------------------------------------

    let authenticatedUserId = null;

    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      try {
        // Reuse existing auth middleware behavior
        // without making login mandatory.
        const jwt = await import("jsonwebtoken");

        const token = authHeader.split(" ")[1];

        const decoded = jwt.default.verify(token, process.env.JWT_SECRET);

        authenticatedUserId = decoded.id;
      } catch {
        // Invalid/expired token simply behaves
        // like a public request.
        authenticatedUserId = null;
      }
    }

    if (authenticatedUserId) {
      const activeUserRequests = await BloodRequest.countDocuments({
        user: authenticatedUserId,
        expiresAt: {
          $gt: new Date(),
        },
      });

      if (activeUserRequests >= MAX_ACTIVE_REQUESTS_PER_USER) {
        return res.status(429).json({
          message:
            "You already have the maximum number of active blood requests.",
        });
      }
    }

    // ------------------------------------------------------
    // Public management token
    // ------------------------------------------------------

    let managementToken = null;
    let managementTokenHash = null;

    // Only public requests need the token.
    if (!authenticatedUserId) {
      managementToken = generateManagementToken();

      managementTokenHash = hashManagementToken(managementToken);
    }

    // ------------------------------------------------------
    // Create request
    // ------------------------------------------------------

    const request = await BloodRequest.create({
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

      managementTokenHash,

      requesterIpHash: ipHash,

      deviceId: cleanDeviceId,

      expiresAt: getRequestExpiry(),
    });

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
});

// ==========================================================
// GET ACTIVE BLOOD REQUESTS
// ==========================================================

/**
 * GET /api/blood/requests
 *
 * Public.
 *
 * Optional filters:
 * - bloodGroup
 * - district
 * - upazila
 * - compensation
 */
router.get("/requests", async (req, res) => {
  try {
    const { bloodGroup, district, upazila, compensation } = req.query;

    const query = {
      expiresAt: {
        $gt: new Date(),
      },
    };

    if (bloodGroup && isValidBloodGroup(bloodGroup.trim())) {
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

    const requests = await BloodRequest.find(query)
      .select(
        "_id bloodGroup bagsNeeded compensationOffered location hospital contactPhone requesterName notes createdAt expiresAt user",
      )
      .sort({
        createdAt: -1,
      })
      .lean();

    const publicRequests = requests.map((request) => ({
      ...publicRequestData(request),

      // Only tells the frontend whether the
      // currently returned request belongs to
      // an account. It does NOT expose user ID.
      hasAccount: Boolean(request.user),
    }));

    res.json({
      requests: publicRequests,
    });
  } catch (error) {
    console.error("Failed to fetch blood requests:", error);

    res.status(500).json({
      message: "Failed to fetch blood requests.",
    });
  }
});

// ==========================================================
// UPDATE BLOOD REQUEST
// ==========================================================

/**
 * PUT /api/blood/requests/:id
 *
 * Logged-in owner:
 *   Authorization: Bearer <token>
 *
 * Public owner:
 *   managementToken in body
 */
router.put("/requests/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const validationError = validateBloodRequest(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const request = await BloodRequest.findById(id).select(
      "+managementTokenHash +requesterIpHash +deviceId",
    );

    if (!request) {
      return res.status(404).json({
        message: "Blood request not found.",
      });
    }

    if (request.expiresAt <= new Date()) {
      return res.status(404).json({
        message: "This blood request has expired.",
      });
    }

    let authorized = false;

    // ----------------------------------------------------
    // Check logged-in ownership
    // ----------------------------------------------------

    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      try {
        const jwt = await import("jsonwebtoken");

        const token = authHeader.split(" ")[1];

        const decoded = jwt.default.verify(token, process.env.JWT_SECRET);

        if (request.user && request.user.toString() === decoded.id) {
          authorized = true;
        }
      } catch {
        // Continue to token authentication.
      }
    }

    // ----------------------------------------------------
    // Check public management token
    // ----------------------------------------------------

    if (!authorized) {
      const managementToken = normalizeString(req.body.managementToken);

      if (
        managementToken &&
        request.managementTokenHash &&
        hashManagementToken(managementToken) === request.managementTokenHash
      ) {
        authorized = true;
      }
    }

    if (!authorized) {
      return res.status(403).json({
        message: "You are not authorized to modify this blood request.",
      });
    }

    // ----------------------------------------------------
    // Update
    // ----------------------------------------------------

    request.bloodGroup = normalizeString(req.body.bloodGroup);

    request.bagsNeeded = Number(req.body.bagsNeeded);

    request.compensationOffered = req.body.compensationOffered;

    request.location = {
      district: normalizeString(req.body.district),

      upazila: normalizeString(req.body.upazila),
    };

    request.hospital = {
      name: normalizeString(req.body.hospitalName),

      address: normalizeString(req.body.hospitalAddress),
    };

    request.contactPhone = normalizeString(req.body.contactPhone);

    request.requesterName = normalizeString(req.body.requesterName);

    request.notes = normalizeString(req.body.notes);

    await request.save();

    return res.json({
      message: "Blood request updated successfully.",

      request: publicRequestData(request),
    });
  } catch (error) {
    console.error("Failed to update blood request:", error);

    res.status(500).json({
      message: "Failed to update blood request.",
    });
  }
});

// ==========================================================
// DELETE BLOOD REQUEST
// ==========================================================

/**
 * DELETE /api/blood/requests/:id
 *
 * Logged-in owner:
 *   Authorization: Bearer <token>
 *
 * Public owner:
 *   managementToken in request body
 */
router.delete("/requests/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const request = await BloodRequest.findById(id).select(
      "+managementTokenHash",
    );

    if (!request) {
      return res.status(404).json({
        message: "Blood request not found.",
      });
    }

    let authorized = false;

    // ----------------------------------------------------
    // Logged-in owner
    // ----------------------------------------------------

    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      try {
        const jwt = await import("jsonwebtoken");

        const token = authHeader.split(" ")[1];

        const decoded = jwt.default.verify(token, process.env.JWT_SECRET);

        if (request.user && request.user.toString() === decoded.id) {
          authorized = true;
        }
      } catch {
        // Continue to management-token check.
      }
    }

    // ----------------------------------------------------
    // Public management token
    // ----------------------------------------------------

    if (!authorized) {
      const managementToken = normalizeString(req.body?.managementToken);

      if (
        managementToken &&
        request.managementTokenHash &&
        hashManagementToken(managementToken) === request.managementTokenHash
      ) {
        authorized = true;
      }
    }

    if (!authorized) {
      return res.status(403).json({
        message: "You are not authorized to delete this blood request.",
      });
    }

    await request.deleteOne();

    return res.json({
      message: "Blood request deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete blood request:", error);

    res.status(500).json({
      message: "Failed to delete blood request.",
    });
  }
});

export default router;
