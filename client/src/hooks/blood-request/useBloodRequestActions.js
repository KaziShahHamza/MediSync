// client/src/hooks/useBloodRequestActions.js

// Manages blood request form, modal, editing, deletion, and token actions.
// Delegates request submission to the dedicated submission hook.

import {
  getManagementToken,
  removeManagementToken,
} from "../../utils/blood/bloodRequestStorage";

import {
  EMPTY_BLOOD_REQUEST_FORM,
  OTHER_HOSPITAL,
} from "../../utils/blood/bloodConstants";

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
  // Updates form fields from user input.
  const handleRequestChange = (event) => {
    const { name, value } = event.target;

    setRequestForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Updates hospital name and address from the selected hospital.
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

  // Opens a fresh request modal.
  const openRequestModal = () => {
    resetRequestForm();
    setRequestSuccess(null);
    setRequestModalOpen(true);
  };

  // Closes the modal unless a request is currently submitting.
  const closeRequestModal = () => {
    if (requestSubmitting) return;

    setRequestModalOpen(false);
    resetRequestForm();
  };

  // Provides the dedicated hook for creating and updating requests.
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

  // Loads an existing request into the form for editing.
  const handleEditRequest = (request) => {
    const savedToken = getManagementToken(request.id);

    if (!user && !savedToken) {
      setRequestError(
        "You do not have the management access for this request.",
      );

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

  // Deletes a blood request after verifying management access.
  const handleDeleteRequest = async (request) => {
    const savedToken = getManagementToken(request.id);

    if (!user && !savedToken) {
      window.alert("You do not have permission to delete this request.");

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
  };
}
