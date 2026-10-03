// client/src/hooks/blood-request/useBloodRequestActions.js

// Manages blood request form, modal, editing, deletion, and token actions.
// Delegates request submission to the dedicated submission hook.

import { useState } from "react";

import {
  getManagementToken,
  removeManagementToken,
  saveManagementToken,
} from "../../utils/blood/bloodRequestStorage";

import {
  EMPTY_BLOOD_REQUEST_FORM,
  OTHER_HOSPITAL,
} from "../../utils/blood/bloodRequestHelpers";

import useSubmitBloodRequest from "./useSubmitBloodRequest";

const API_URL = import.meta.env.VITE_API_URL;

export default function useBloodRequestActions({
  user,
  requestForm,
  setRequestForm,
  selectedHospitalList,
  requestSubmitting,
  setRequestSubmitting,
  setRequestError,
  setRequestSuccess,
  setBloodRequests,
  setRequestModalOpen,
  editingRequest,
  setEditingRequest,
  managementToken,
  setManagementToken,
  setCopied,
  fetchBloodRequests,
  isEditingRequestRef,
}) {
  const [managementTokenModalOpen, setManagementTokenModalOpen] =
    useState(false);

  const [managementTokenRequest, setManagementTokenRequest] = useState(null);

  const [managementTokenAction, setManagementTokenAction] = useState(null);

  const [managementTokenSubmitting, setManagementTokenSubmitting] =
    useState(false);

  const [managementTokenError, setManagementTokenError] = useState("");

  // Updates form fields from user input.
  const handleRequestChange = (event) => {
    const { name, value } = event.target;

    setRequestForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Updates hospital details based on the selected hospital.
  const handleHospitalChange = (event) => {
    const value = event.target.value;

    if (value === OTHER_HOSPITAL) {
      setRequestForm((previous) => ({
        ...previous,
        hospitalName: "",
        hospitalAddress: "",
      }));

      return;
    }

    const hospital = selectedHospitalList.find((item) => item.name === value);

    setRequestForm((previous) => ({
      ...previous,
      hospitalName: hospital?.name || "",
      hospitalAddress: hospital?.address || "",
    }));
  };

  // Resets the request form and editing state.
  const resetRequestForm = () => {
    setRequestForm(EMPTY_BLOOD_REQUEST_FORM);
    setRequestError("");
    setEditingRequest(null);
  };

  // Opens the modal with a fresh request form.
  const openRequestModal = () => {
    resetRequestForm();
    setRequestSuccess(null);
    setRequestModalOpen(true);
  };

  // Closes the modal unless submission is currently in progress.
  const closeRequestModal = () => {
    if (requestSubmitting) return;

    setRequestModalOpen(false);
    resetRequestForm();
  };

  // Provides submission logic for creating and updating requests.
  const { submitBloodRequest } = useSubmitBloodRequest({
    user,
    requestForm,
    requestSubmitting,
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
  });

  // Opens token authorization when guest management access is required.
  const openManagementTokenModal = (request, action) => {
    setManagementTokenRequest(request);
    setManagementTokenAction(action);
    setManagementTokenError("");
    setManagementTokenModalOpen(true);
  };

  // Closes the management token modal and clears its temporary state.
  const closeManagementTokenModal = () => {
    if (managementTokenSubmitting) return;

    setManagementTokenModalOpen(false);
    setManagementTokenRequest(null);
    setManagementTokenAction(null);
    setManagementTokenError("");
  };

  // Verifies and stores a guest management token before continuing the action.
  const handleManagementTokenSubmit = async (token) => {
    const normalizedToken = token.trim();

    if (!managementTokenRequest || !normalizedToken) {
      return;
    }

    try {
      setManagementTokenSubmitting(true);
      setManagementTokenError("");

      const response = await fetch(
        `${API_URL}/api/blood/requests/${managementTokenRequest.id}/authorize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            managementToken: normalizedToken,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid management token.");
      }

      saveManagementToken(managementTokenRequest.id, normalizedToken);

      setManagementToken(normalizedToken);

      const request = managementTokenRequest;
      const action = managementTokenAction;

      setManagementTokenModalOpen(false);
      setManagementTokenRequest(null);
      setManagementTokenAction(null);

      if (action === "edit") {
        handleEditRequest(request, normalizedToken);
      }

      if (action === "delete") {
        await handleDeleteRequest(request, normalizedToken);
      }
    } catch (err) {
      console.error("Blood request token verification failed:", err);

      setManagementTokenError(
        err.message || "Unable to verify management token.",
      );
    } finally {
      setManagementTokenSubmitting(false);
    }
  };

  // Loads an existing request into the editable form.
  const handleEditRequest = (request, authorizedToken = null) => {
    const savedToken = authorizedToken || getManagementToken(request.id);

    const isOwner = Boolean(user && request.isOwner);

    if (!isOwner && !savedToken) {
      openManagementTokenModal(request, "edit");

      return;
    }

    setManagementToken(savedToken || "");
    setEditingRequest(request);

    // Prevents the district effect from clearing loaded location fields.
    isEditingRequestRef.current = true;

    setRequestForm({
      bloodGroup: request.bloodGroup,
      bagsNeeded: String(request.bagsNeeded),
      compensationOffered: request.compensationOffered ? "yes" : "no",
      district: request.district,
      upazila: request.upazila,
      hospitalName: request.hospital?.name || "",
      hospitalAddress: request.hospital?.address || "",
      contactPhone: request.contactPhone || "",
      requesterName: request.requesterName || "",
      notes: request.notes || "",
    });

    setRequestError("");
    setRequestSuccess(null);
    setRequestModalOpen(true);
  };

  // Deletes a request after verifying management access.
  const handleDeleteRequest = async (request, authorizedToken = null) => {
    const savedToken = authorizedToken || getManagementToken(request.id);

    const isOwner = Boolean(user && request.isOwner);

    if (!isOwner && !savedToken) {
      openManagementTokenModal(request, "delete");

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this blood request?",
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/blood/requests/${request.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            managementToken: savedToken || "",
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete blood request.");
      }

      setBloodRequests((previous) =>
        previous.filter((item) => item.id !== request.id),
      );

      removeManagementToken(request.id);
    } catch (err) {
      console.error("Blood request deletion failed:", err);

      window.alert(err.message || "Unable to delete blood request.");
    }
  };

  // Copies the active guest management token to the clipboard.
  const copyManagementToken = async () => {
    if (!managementToken) return;

    try {
      await navigator.clipboard.writeText(managementToken);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  return {
    handleRequestChange,
    handleHospitalChange,
    openRequestModal,
    closeRequestModal,
    submitBloodRequest,
    handleEditRequest,
    handleDeleteRequest,
    copyManagementToken,

    managementTokenModalOpen,
    managementTokenRequest,
    managementTokenAction,
    managementTokenSubmitting,
    managementTokenError,
    handleManagementTokenSubmit,
    closeManagementTokenModal,
  };
}
