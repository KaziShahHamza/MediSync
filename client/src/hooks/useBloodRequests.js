// client/src/hooks/useBloodRequests.js

import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../context/AuthContext";

import { districtsData } from "../data/districtsData";
import hospitalsData from "../data/hospitalsData";

import {
  EMPTY_BLOOD_REQUEST_FORM,
  OTHER_HOSPITAL,
} from "../utils/blood/bloodConstants";

import {
  getDeviceId,
  getManagementToken,
  removeManagementToken,
  saveManagementToken,
} from "../utils/blood/bloodRequestStorage";

const API_URL = import.meta.env.VITE_API_URL;

// Custom hook to manage blood requests state, fetching, submitting, editing, and modal state
export default function useBloodRequests() {
  const { user } = useAuth();

  const [requestForm, setRequestForm] = useState(EMPTY_BLOOD_REQUEST_FORM);

  const [requestModalOpen, setRequestModalOpen] = useState(false);

  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState(null);

  const [bloodRequests, setBloodRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState("");

  const [editingRequest, setEditingRequest] = useState(null);

  const [managementToken, setManagementToken] = useState("");
  const [copied, setCopied] = useState(false);

  // Computes selected district object from request form state
  const selectedDistrict = useMemo(
    () => districtsData.find((item) => item.name === requestForm.district),
    [requestForm.district],
  );

  const requestUpazilas = selectedDistrict?.upazilas || [];

  const selectedHospitalList = hospitalsData[requestForm.district] || [];

  // Resets dependent location inputs when selected district changes
  useEffect(() => {
    setRequestForm((previous) => ({
      ...previous,
      upazila: "",
      hospitalName: "",
      hospitalAddress: "",
    }));
  }, [requestForm.district]);

  // Initializes device identifier on initial render
  useEffect(() => {
    getDeviceId();
  }, []);

  // Fetches list of all active blood requests from API
  const fetchBloodRequests = async () => {
    try {
      setRequestsLoading(true);
      setRequestsError("");

      const response = await fetch(`${API_URL}/api/blood/requests`);

      if (!response.ok) {
        throw new Error("Failed to load blood requests.");
      }

      const data = await response.json();

      setBloodRequests(data.requests || []);
    } catch (err) {
      console.error("Blood request fetch failed:", err);

      setRequestsError(err.message || "Unable to load blood requests.");
    } finally {
      setRequestsLoading(false);
    }
  };

  // Triggers blood request fetch on mount and polls periodically
  useEffect(() => {
    fetchBloodRequests();

    const interval = setInterval(fetchBloodRequests, 60000);

    return () => clearInterval(interval);
  }, []);

  // Handles text input changes for request form
  const handleRequestChange = (event) => {
    const { name, value } = event.target;

    setRequestForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Handles dropdown selection for hospital inputs
  const handleHospitalChange = (event) => {
    const value = event.target.value;

    // Clears hospital name and address for custom input option
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

  const isHospitalFromList = selectedHospitalList.some(
    (hospital) => hospital.name === requestForm.hospitalName,
  );

  const hospitalSelectValue = isHospitalFromList
    ? requestForm.hospitalName
    : OTHER_HOSPITAL;

  // Clears request form inputs and validation errors
  const resetRequestForm = () => {
    setRequestForm(EMPTY_BLOOD_REQUEST_FORM);
    setRequestError("");
    setEditingRequest(null);
  };

  // Opens request modal with clean state
  const openRequestModal = () => {
    resetRequestForm();
    setRequestSuccess(null);
    setRequestModalOpen(true);
  };

  // Closes request modal unless form is currently submitting
  const closeRequestModal = () => {
    if (requestSubmitting) return;

    setRequestModalOpen(false);
    resetRequestForm();
  };

  // Submits blood request payload for creation or updates
  const submitBloodRequest = async (event) => {
    event.preventDefault();

    try {
      setRequestSubmitting(true);
      setRequestError("");

      const deviceId = getDeviceId();
      const token = localStorage.getItem("token");

      // Prepares request body structure
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

      // Attaches management token for guest edits
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

      // Handles state updates for modified existing requests
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

      // Saves new request token locally for guest management
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

      await fetchBloodRequests();
    } catch (err) {
      console.error("Blood request submission failed:", err);

      setRequestError(err.message || "Unable to save blood request.");
    } finally {
      setRequestSubmitting(false);
    }
  };

  // Pre-fills form fields to edit selected request
  const handleEditRequest = (request) => {
    const savedToken = getManagementToken(request.id);

    // Verifies management authorization before editing
    if (!user && !savedToken) {
      setRequestError(
        "You do not have the management access for this request.",
      );

      return;
    }

    setManagementToken(savedToken || "");
    setEditingRequest(request);

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

  // Removes blood request entry via API call
  const handleDeleteRequest = async (request) => {
    const savedToken = getManagementToken(request.id);

    // Verifies management authorization before deletion
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

  // Copies active management token string to clipboard
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
    user,

    bloodRequests,
    requestsLoading,
    requestsError,
    fetchBloodRequests,

    requestForm,
    setRequestForm,
    handleRequestChange,

    requestUpazilas,
    selectedHospitalList,
    hospitalSelectValue,
    handleHospitalChange,

    requestModalOpen,
    openRequestModal,
    closeRequestModal,

    requestSubmitting,
    requestError,
    requestSuccess,
    submitBloodRequest,

    editingRequest,
    handleEditRequest,
    handleDeleteRequest,

    managementToken,
    copied,
    copyManagementToken,
  };
}
