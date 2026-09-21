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

export default function useBloodRequests() {
  const { user } = useAuth();

  // Request form
  const [requestForm, setRequestForm] = useState(EMPTY_BLOOD_REQUEST_FORM);

  // Modal
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  // Submit state
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState(null);

  // Requests
  const [bloodRequests, setBloodRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState("");

  // Editing
  const [editingRequest, setEditingRequest] = useState(null);

  // Management token
  const [managementToken, setManagementToken] = useState("");
  const [copied, setCopied] = useState(false);

  // ---------------------------------------------------------------------------
  // Request location data
  // ---------------------------------------------------------------------------

  const selectedDistrict = useMemo(
    () => districtsData.find((item) => item.name === requestForm.district),
    [requestForm.district],
  );

  const requestUpazilas = selectedDistrict?.upazilas || [];

  const selectedHospitalList = hospitalsData[requestForm.district] || [];

  useEffect(() => {
    setRequestForm((previous) => ({
      ...previous,
      upazila: "",
      hospitalName: "",
      hospitalAddress: "",
    }));
  }, [requestForm.district]);

  // ---------------------------------------------------------------------------
  // Device ID
  // ---------------------------------------------------------------------------

  useEffect(() => {
    getDeviceId();
  }, []);

  // ---------------------------------------------------------------------------
  // Fetch blood requests
  // ---------------------------------------------------------------------------

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

  useEffect(() => {
    fetchBloodRequests();

    const interval = setInterval(fetchBloodRequests, 60000);

    return () => clearInterval(interval);
  }, []);

  // ---------------------------------------------------------------------------
  // Request form changes
  // ---------------------------------------------------------------------------

  const handleRequestChange = (event) => {
    const { name, value } = event.target;

    setRequestForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ---------------------------------------------------------------------------
  // Hospital selection
  // ---------------------------------------------------------------------------

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

  const isHospitalFromList = selectedHospitalList.some(
    (hospital) => hospital.name === requestForm.hospitalName,
  );

  const hospitalSelectValue = isHospitalFromList
    ? requestForm.hospitalName
    : OTHER_HOSPITAL;

  // ---------------------------------------------------------------------------
  // Reset / modal controls
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Create / update blood request
  // ---------------------------------------------------------------------------

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

      // Updating an existing request
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

      // Creating a new request
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

  // ---------------------------------------------------------------------------
  // Edit blood request
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Delete blood request
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Copy management token
  // ---------------------------------------------------------------------------

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
    // Auth
    user,

    // Requests
    bloodRequests,
    requestsLoading,
    requestsError,
    fetchBloodRequests,

    // Form
    requestForm,
    setRequestForm,
    handleRequestChange,

    // Location
    requestUpazilas,
    selectedHospitalList,
    hospitalSelectValue,
    handleHospitalChange,

    // Modal
    requestModalOpen,
    openRequestModal,
    closeRequestModal,

    // Submission
    requestSubmitting,
    requestError,
    requestSuccess,
    submitBloodRequest,

    // Editing / deleting
    editingRequest,
    handleEditRequest,
    handleDeleteRequest,

    // Management token
    managementToken,
    copied,
    copyManagementToken,
  };
}
