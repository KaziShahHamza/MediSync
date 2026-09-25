// server/controllers/blood/bloodRequestManagementController.js

// Controller handling donor searches, updating existing blood requests,
// and deleting active requests with authorization checks.

import {
  findRequestForUpdate,
  updateRequest,
  findRequestForDelete,
  deleteRequest,
} from "../../services/blood/bloodRequestManagementService.js";

import { validateBloodRequest } from "../../utils/blood/bloodRequestValidation.js";

import { publicRequestData } from "../../utils/blood/bloodRequestHelpers.js";

import { authorizeBloodRequest } from "../../middlewares/bloodRequestAuth.js";

import { findDonors } from "../../services/blood/bloodDonorService.js";

// Retrieves list of eligible donors matching criteria
export async function getDonors(req, res) {
  try {
    const { bloodGroup, district, upazila, compensation } = req.query;

    // Fetch matching donors from service layer
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

// Updates an existing blood request if valid and authorized
export async function updateBloodRequest(req, res) {
  try {
    const { id } = req.params;

    const validationError = validateBloodRequest(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    // Retrieve active record to ensure existence
    const request = await findRequestForUpdate(id);

    if (!request) {
      return res.status(404).json({
        message: "Blood request not found.",
      });
    }

    // Reject modifications to expired requests
    if (request.expiresAt <= new Date()) {
      return res.status(404).json({
        message: "This blood request has expired.",
      });
    }

    // Check modifying permissions via bearer token or guest token
    const authorized = authorizeBloodRequest(req, request);

    if (!authorized) {
      return res.status(403).json({
        message: "You are not authorized to modify this blood request.",
      });
    }

    // Save updated request data to storage
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

// Deletes a blood request record after passing authorization
export async function deleteBloodRequest(req, res) {
  try {
    const { id } = req.params;

    const request = await findRequestForDelete(id);

    if (!request) {
      return res.status(404).json({
        message: "Blood request not found.",
      });
    }

    // Confirm permissions before performing deletion
    const authorized = authorizeBloodRequest(req, request);

    if (!authorized) {
      return res.status(403).json({
        message: "You are not authorized to delete this blood request.",
      });
    }

    // Remove blood request entry
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
