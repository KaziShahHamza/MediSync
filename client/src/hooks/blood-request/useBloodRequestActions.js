// client/src/hooks/blood-request/useBloodRequestActions.js

// Manages blood request form, modal, editing, and deletion.
// Delegates token management to the dedicated token action hook.
// Delegates request submission to the dedicated submission hook.

import {
  getManagementToken,
  removeManagementToken,
} from "../../utils/blood/bloodRequestStorage";

import {
  EMPTY_BLOOD_REQUEST_FORM,
  OTHER_HOSPITAL,
} from "../../utils/blood/bloodRequestHelpers";
import { normalizeBloodRequestPhone } from "../../utils/blood/bloodRequestValidation";

import useBloodRequestTokenActions from "./useBloodRequestTokenActions";
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
  currentPage,
  pagination,
  setCurrentPage,
}) {
  const handleRequestChange = (event) => {
    const { name, value } = event.target;
    const normalizedValue =
      name === "contactPhone" ? normalizeBloodRequestPhone(value) : value;

    setRequestForm((previous) => ({
      ...previous,
      [name]: normalizedValue,
    }));
  };

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

  const resetRequestForm = () => {
    setRequestForm(EMPTY_BLOOD_REQUEST_FORM);
    setRequestError("");
    setEditingRequest(null);
  };

  const openRequestModal = () => {
    resetRequestForm();
    setRequestSuccess(null);
    setRequestModalOpen(true);
  };

  const closeRequestModal = () => {
    if (requestSubmitting) return;

    setRequestModalOpen(false);
    resetRequestForm();
  };

  const handleEditRequest = (request, authorizedToken = null) => {
    const savedToken = authorizedToken || getManagementToken(request.id);

    const isOwner = Boolean(user && request.isOwner);

    if (!isOwner && !savedToken) {
      openManagementTokenModal(request, "edit");

      return;
    }

    setManagementToken(savedToken || "");
    setEditingRequest(request);

    isEditingRequestRef.current = true;

    setRequestForm({
      bloodGroup: request.bloodGroup,
      bagsNeeded: String(request.bagsNeeded),
      neededWithinDays: String(request.neededWithinDays || ""),
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

  const handleDeleteRequest = async (request, authorizedToken = null) => {
    const savedToken = authorizedToken || getRequestToken(request);

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

      removeManagementToken(request.id);

      // Refresh the current server page so pagination metadata stays correct.
      const nextTotalRequests = Math.max(
        (pagination.totalRequests || 0) - 1,
        0,
      );

      const nextTotalPages = Math.max(
        Math.ceil(nextTotalRequests / (pagination.limit || 20)),
        1,
      );

      const targetPage = Math.min(currentPage, nextTotalPages);

      setCurrentPage(targetPage);

      await fetchBloodRequests(targetPage);
    } catch (err) {
      console.error("Blood request deletion failed:", err);

      window.alert(err.message || "Unable to delete blood request.");
    }
  };

  const {
    getRequestToken,
    openManagementTokenModal,
    closeManagementTokenModal,
    handleManagementTokenSubmit,
    copyManagementToken,
    managementTokenModalOpen,
    managementTokenRequest,
    managementTokenAction,
    managementTokenSubmitting,
    managementTokenError,
  } = useBloodRequestTokenActions({
    managementToken,
    setManagementToken,
    setCopied,
    onEditRequest: handleEditRequest,
    onDeleteRequest: handleDeleteRequest,
  });

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
    currentPage,
    pagination,
    setCurrentPage,
  });

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
