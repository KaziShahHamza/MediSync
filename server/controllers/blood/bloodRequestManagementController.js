// server/controllers/blood/bloodRequestManagementController.js

// Controller handling donor searches, updating existing blood requests,
// and deleting active requests with authorization checks.

import {
  findRequestForUpdate,
  updateRequest,
  findRequestForDelete,
  deleteRequest,
  findDonors,
} from "../../services/blood/bloodRequestManagementService.js";

import { validateBloodRequest } from "../../utils/blood/bloodRequestValidation.js";

import {
  publicRequestData,
  hashManagementToken,
} from "../../utils/blood/bloodRequestHelpers.js";

import { authorizeBloodRequest } from "../../middlewares/bloodRequestAuth.js";

// Retrieves a paginated list of eligible donors matching criteria.
export async function getDonors(req, res) {
  try {
    const { bloodGroup, district, upazila, compensation } = req.query;

    const page = Number.parseInt(req.query.page, 10) || 1;

    // Keep the API page size fixed.
    const limit = 20;

    const currentPage = Math.max(page, 1);

    const result = await findDonors({
      bloodGroup,
      district,
      upazila,
      compensation,
      page: currentPage,
      limit,
    });

    return res.json({
      donors: result.donors,

      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalDonors: result.totalDonors,
        limit: result.limit,
      },
    });
  } catch (error) {
    console.error("Failed to fetch blood donors:", error);

    return res.status(500).json({
      message: "Failed to fetch blood donors.",
    });
  }
}

// Updates an existing blood request if valid and authorized.
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

    const authorized = authorizeBloodRequest(req, request);

    if (!authorized) {
      return res.status(403).json({
        message: "You are not authorized to modify this blood request.",
      });
    }

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

// Deletes a blood request record after passing authorization.
export async function deleteBloodRequest(req, res) {
  try {
    const { id } = req.params;

    const request = await findRequestForDelete(id);

    if (!request) {
      return res.status(404).json({
        message: "Blood request not found.",
      });
    }

    // Do not allow deletion of an expired request.
    if (request.expiresAt <= new Date()) {
      return res.status(404).json({
        message: "This blood request has expired.",
      });
    }

    const authorized = authorizeBloodRequest(req, request);

    if (!authorized) {
      return res.status(403).json({
        message: "You are not authorized to delete this blood request.",
      });
    }

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

// Verifies a public management token without exposing the stored token hash.
export async function authorizeBloodRequestManagement(req, res) {
  try {
    const { id } = req.params;

    const managementToken =
      typeof req.body?.managementToken === "string"
        ? req.body.managementToken.trim()
        : "";

    if (!managementToken) {
      return res.status(400).json({
        message: "Management token is required.",
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

    if (
      !request.managementTokenHash ||
      hashManagementToken(managementToken) !== request.managementTokenHash
    ) {
      return res.status(403).json({
        message: "Invalid management token.",
      });
    }

    return res.json({
      authorized: true,
      message: "Management access verified.",
    });
  } catch (error) {
    console.error("Failed to verify blood request management token:", error);

    return res.status(500).json({
      message: "Failed to verify management token.",
    });
  }
}
