// client/src/hooks/useBloodRequests.js

// Manages blood request state, location data, fetching, and derived values.
// Delegates request actions to the blood request action hook.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "../../context/AuthContext";

import { districtsData } from "../../data/districtsData";
import hospitalsData from "../../data/hospitalsData";

import {
  EMPTY_BLOOD_REQUEST_FORM,
  OTHER_HOSPITAL,
} from "../../utils/blood/bloodConstants";

import { getDeviceId } from "../../utils/blood/bloodRequestStorage";

import useBloodRequestActions from "./useBloodRequestActions";

const API_URL = import.meta.env.VITE_API_URL;

export default function useBloodRequests() {
  // Retrieves the currently authenticated user.
  const { user } = useAuth();

  // Stores request form and modal state.
  const [requestForm, setRequestForm] = useState(EMPTY_BLOOD_REQUEST_FORM);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  // Stores request submission status and feedback.
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState(null);

  // Stores fetched requests and their loading state.
  const [bloodRequests, setBloodRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState("");

  const [editingRequest, setEditingRequest] = useState(null);

  // Stores guest management token and clipboard state.
  const [managementToken, setManagementToken] = useState("");
  const [copied, setCopied] = useState(false);

  // Tracks request editing to preserve loaded location values.
  const isEditingRequestRef = useRef(false);

  // Finds the selected district and its available upazilas.
  const selectedDistrict = useMemo(
    () => districtsData.find((item) => item.name === requestForm.district),
    [requestForm.district],
  );

  const requestUpazilas = selectedDistrict?.upazilas || [];

  const selectedHospitalList = hospitalsData[requestForm.district] || [];

  // Clears dependent location fields after manual district changes.
  useEffect(() => {
    if (isEditingRequestRef.current) {
      isEditingRequestRef.current = false;

      return;
    }

    setRequestForm((previous) => ({
      ...previous,
      upazila: "",
      hospitalName: "",
      hospitalAddress: "",
    }));
  }, [requestForm.district]);

  // Initializes the device identifier used by guest requests.
  useEffect(() => {
    getDeviceId();
  }, []);

  // Fetches active blood requests from the backend.
  const fetchBloodRequests = useCallback(async () => {
    try {
      setRequestsLoading(true);
      setRequestsError("");

      const response = await fetch(`${API_URL}/api/blood/requests`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load blood requests.");
      }

      setBloodRequests(Array.isArray(data.requests) ? data.requests : []);
    } catch (err) {
      console.error("Blood request fetch failed:", err);

      setRequestsError(err.message || "Unable to load blood requests.");
    } finally {
      setRequestsLoading(false);
    }
  }, []);

  // Loads requests initially and refreshes them every minute.
  useEffect(() => {
    fetchBloodRequests();

    const interval = setInterval(fetchBloodRequests, 60000);

    return () => clearInterval(interval);
  }, [fetchBloodRequests]);

  // Determines whether the selected hospital is predefined.
  const isHospitalFromList = selectedHospitalList.some(
    (hospital) => hospital.name === requestForm.hospitalName,
  );

  const hospitalSelectValue = isHospitalFromList
    ? requestForm.hospitalName
    : OTHER_HOSPITAL;

  // Connects request state with form and CRUD actions.
  const {
    handleRequestChange,
    handleHospitalChange,
    openRequestModal,
    closeRequestModal,
    submitBloodRequest,
    handleEditRequest,
    handleDeleteRequest,
    copyManagementToken,
  } = useBloodRequestActions({
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
  });

  // Exposes state and actions required by the blood request page.
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
