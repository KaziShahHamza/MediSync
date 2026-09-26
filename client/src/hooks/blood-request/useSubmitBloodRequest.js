// client/src/hooks/useSubmitBloodRequest.js

// Handles creation and updating of blood requests through the backend API.
// Manages submission state, success feedback, and guest management tokens.

import {
  getDeviceId,
  saveManagementToken,
} from "../../utils/blood/bloodRequestStorage";

import { EMPTY_BLOOD_REQUEST_FORM } from "../../utils/blood/bloodConstants";

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
}) {
  // Submits a new blood request or updates an existing one.
  const submitBloodRequest = async (event) => {
    event.preventDefault();

    try {
      setRequestSubmitting(true);
      setRequestError("");

      const deviceId = getDeviceId();
      const token = localStorage.getItem("token");

      // Builds the backend payload from the current form state.
      const body = {
        bloodGroup: requestForm.bloodGroup,
        bagsNeeded: Number(requestForm.bagsNeeded),
        compensationOffered: requestForm.compensationOffered === "yes",
        district: requestForm.district,
        upazila: requestForm.upazila,
        hospitalName: requestForm.hospitalName,
        hospitalAddress: requestForm.hospitalAddress,
        contactPhone: requestForm.contactPhone,
        requesterName: requestForm.requesterName,
        notes: requestForm.notes,
        deviceId,
      };

      // Adds the guest management token when editing.
      if (!user && managementToken) {
        body.managementToken = managementToken;
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
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save blood request.");
      }

      // Updates the local list after an existing request is edited.
      if (editingRequest) {
        setBloodRequests((previous) =>
          previous.map((item) =>
            item.id === editingRequest.id ? data.request : item,
          ),
        );

        setRequestSuccess({
          type: "updated",
          message: "Your blood request was updated successfully.",
        });

        setEditingRequest(null);
        setRequestForm(EMPTY_BLOOD_REQUEST_FORM);

        return;
      }

      // Saves the management token for newly created guest requests.
      if (data.managementToken) {
        saveManagementToken(data.request.id, data.managementToken);

        setManagementToken(data.managementToken);
      }

      // Stores creation feedback and request details.
      setRequestSuccess({
        type: "created",
        message: "Your blood request has been posted successfully.",
        request: data.request,
        managementToken: data.managementToken,
      });

      setRequestForm(EMPTY_BLOOD_REQUEST_FORM);

      // Refreshes the request list after successful creation.
      await fetchBloodRequests();
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
