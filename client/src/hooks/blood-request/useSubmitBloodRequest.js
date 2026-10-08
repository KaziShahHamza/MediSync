// client/src/hooks/blood-request/useSubmitBloodRequest.js

// Handles creation and updating of blood requests through the backend API.
// Manages submission state, success feedback, guest management tokens, and pagination refreshes.

import {
  getDeviceId,
  saveManagementToken,
} from "../../utils/blood/bloodRequestStorage";

import { EMPTY_BLOOD_REQUEST_FORM } from "../../utils/blood/bloodRequestHelpers";
import { validateBloodRequestForm } from "../../utils/blood/bloodRequestValidation";

const API_URL = import.meta.env.VITE_API_URL;

export default function useSubmitBloodRequest({
  user,
  requestForm,
  setRequestSubmitting,
  setRequestError,
  setRequestSuccess,
  setBloodRequests,
  editingRequest,
  setEditingRequest,
  managementToken,
  setManagementToken,
  setRequestForm,
  fetchBloodRequests,
  currentPage,
  pagination,
  setCurrentPage,
}) {
  const submitBloodRequest = async (event) => {
    event.preventDefault();

    try {
      setRequestSubmitting(true);
      setRequestError("");

      const deviceId = getDeviceId();
      const token = localStorage.getItem("token");

      const body = {
        bloodGroup: requestForm.bloodGroup,
        bagsNeeded: Number(requestForm.bagsNeeded),
        neededWithinDays: Number(requestForm.neededWithinDays),
        compensationOffered: requestForm.compensationOffered,
        district: requestForm.district,
        upazila: requestForm.upazila,
        hospitalName: requestForm.hospitalName,
        hospitalAddress: requestForm.hospitalAddress,
        contactPhone: requestForm.contactPhone,
        requesterName: requestForm.requesterName,
        notes: requestForm.notes,
        deviceId,
      };

      if (!user && managementToken) {
        body.managementToken = managementToken;
      }

      const validation = validateBloodRequestForm(body);

      if (Object.keys(validation.errors).length > 0) {
        setRequestError(Object.values(validation.errors)[0]);
        return;
      }

      const url = editingRequest
        ? `${API_URL}/api/blood/requests/${editingRequest.id}`
        : `${API_URL}/api/blood/requests`;

      const method = editingRequest ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(validation.values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save blood request.");
      }

      if (editingRequest) {
        setRequestSuccess({
          type: "updated",
          message: "Your blood request was updated successfully.",
        });

        setEditingRequest(null);
        setRequestForm(EMPTY_BLOOD_REQUEST_FORM);

        // Re-fetch the current server page so the updated expiration
        // and pagination state are authoritative.
        await fetchBloodRequests(currentPage);

        return;
      }

      if (data.managementToken) {
        saveManagementToken(data.request.id, data.managementToken);

        setManagementToken(data.managementToken);
      }

      setRequestSuccess({
        type: "created",
        message: "Your blood request has been posted successfully.",
        request: data.request,
        managementToken: data.managementToken,
      });

      setRequestForm(EMPTY_BLOOD_REQUEST_FORM);

      // New requests are sorted first, so return to page 1.
      setCurrentPage(1);

      await fetchBloodRequests(1);
    } catch (err) {
      console.error("Blood request submission failed:", err);

      setRequestError(err.message || "Unable to save blood request.");
    } finally {
      setRequestSubmitting(false);
    }
  };

  return {
    submitBloodRequest,
  };
}
