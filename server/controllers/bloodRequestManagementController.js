import {
  findRequestForUpdate,
  updateRequest,
  findRequestForDelete,
  deleteRequest,
} from "../services/bloodRequestService.js";

import { validateBloodRequest } from "../utils/bloodRequestValidation.js";

import { publicRequestData } from "../utils/bloodRequestHelpers.js";

import { authorizeBloodRequest } from "../middlewares/bloodRequestAuth.js";

import { findDonors } from "../services/bloodRequestService.js";

// ==========================================================
// GET DONORS
// ==========================================================

export async function getDonors(req, res) {
  try {
    const { bloodGroup, district, upazila, compensation } = req.query;

    const donors = await findDonors({
      bloodGroup,
      district,
      upazila,
      compensation,
    });

    return res.json({
      donors,
    });
  } catch (error) {
    console.error("Failed to fetch blood donors:", error);

    return res.status(500).json({
      message: "Failed to fetch blood donors",
    });
  }
}


// ==========================================================
// UPDATE BLOOD REQUEST
// ==========================================================

export async function updateBloodRequest(req, res) {
  try {
    const { id } = req.params;

    const validationError = validateBloodRequest(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const request = await findRequestForUpdate(id);

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

    // ------------------------------------------------------
    // Authorization
    // ------------------------------------------------------

    const authorized = authorizeBloodRequest(req, request);

    if (!authorized) {
      return res.status(403).json({
        message: "You are not authorized to modify this blood request.",
      });
    }

    // ------------------------------------------------------
    // Update
    // ------------------------------------------------------

    const updatedRequest = await updateRequest(request, req.body);

    return res.json({
      message: "Blood request updated successfully.",

      request: publicRequestData(updatedRequest),
    });
  } catch (error) {
    console.error("Failed to update blood request:", error);

    return res.status(500).json({
      message: "Failed to update blood request.",
    });
  }
}

// ==========================================================
// DELETE BLOOD REQUEST
// ==========================================================

export async function deleteBloodRequest(req, res) {
  try {
    const { id } = req.params;

    const request = await findRequestForDelete(id);

    if (!request) {
      return res.status(404).json({
        message: "Blood request not found.",
      });
    }

    // ------------------------------------------------------
    // Authorization
    // ------------------------------------------------------

    const authorized = authorizeBloodRequest(req, request);

    if (!authorized) {
      return res.status(403).json({
        message: "You are not authorized to delete this blood request.",
      });
    }

    // ------------------------------------------------------
    // Delete
    // ------------------------------------------------------

    await deleteRequest(request);

    return res.json({
      message: "Blood request deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete blood request:", error);

    return res.status(500).json({
      message: "Failed to delete blood request.",
    });
  }
}
