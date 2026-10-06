// client/src/hooks/blood-request/useBloodRequests.js

// Manages blood request state, location data, fetching, pagination, and derived values.
// Delegates request actions to the blood request action hook.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "../../context/AuthContext";

import { districtsData } from "../../data/districtsData";
import hospitalsData from "../../data/hospitalsData";

import {
  EMPTY_BLOOD_REQUEST_FORM,
  OTHER_HOSPITAL,
} from "../../utils/blood/bloodRequestHelpers";

import { getDeviceId } from "../../utils/blood/bloodRequestStorage";

import useBloodRequestActions from "./useBloodRequestActions";

const API_URL = import.meta.env.VITE_API_URL;
const REQUESTS_PER_PAGE = 20;

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

  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRequests: 0,
    limit: REQUESTS_PER_PAGE,
  });

  const [editingRequest, setEditingRequest] = useState(null);

  const [managementToken, setManagementToken] = useState("");
  const [copied, setCopied] = useState(false);

  const isEditingRequestRef = useRef(false);

  const selectedDistrict = useMemo(
    () => districtsData.find((item) => item.name === requestForm.district),
    [requestForm.district],
  );

  const requestUpazilas = selectedDistrict?.upazilas || [];

  const selectedHospitalList = hospitalsData[requestForm.district] || [];

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

  useEffect(() => {
    getDeviceId();
  }, []);

  // Fetches one server-side page of active blood requests.
  const fetchBloodRequests = useCallback(
    async (page = currentPage) => {
      try {
        setRequestsLoading(true);
        setRequestsError("");

        const token = localStorage.getItem("token");

        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", REQUESTS_PER_PAGE);

        const response = await fetch(
          `${API_URL}/api/blood/requests?${params.toString()}`,
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {},
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load blood requests.");
        }

        const requests = Array.isArray(data.requests) ? data.requests : [];
        const responsePagination = data.pagination || {};

        const resolvedPage = responsePagination.currentPage || page;

        setBloodRequests(requests);

        setPagination({
          currentPage: resolvedPage,
          totalPages: responsePagination.totalPages || 1,
          totalRequests: responsePagination.totalRequests || 0,
          limit: responsePagination.limit || REQUESTS_PER_PAGE,
        });

        setCurrentPage(resolvedPage);
      } catch (err) {
        console.error("Blood request fetch failed:", err);

        setBloodRequests([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalRequests: 0,
          limit: REQUESTS_PER_PAGE,
        });
        setCurrentPage(1);

        setRequestsError(err.message || "Unable to load blood requests.");
      } finally {
        setRequestsLoading(false);
      }
    },
    [currentPage],
  );

  useEffect(() => {
    fetchBloodRequests(1);
  }, []);

  const handlePageChange = useCallback(
    (page) => {
      if (
        requestsLoading ||
        page < 1 ||
        page > pagination.totalPages ||
        page === currentPage
      ) {
        return;
      }

      fetchBloodRequests(page);
    },
    [requestsLoading, pagination.totalPages, currentPage, fetchBloodRequests],
  );

  const isHospitalFromList = selectedHospitalList.some(
    (hospital) => hospital.name === requestForm.hospitalName,
  );

  const hospitalSelectValue = isHospitalFromList
    ? requestForm.hospitalName
    : OTHER_HOSPITAL;

  const {
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
    currentPage,
    pagination,
    setCurrentPage,
  });

  return {
    user,

    bloodRequests,
    requestsLoading,
    requestsError,
    fetchBloodRequests,

    currentPage,
    totalPages: pagination.totalPages,
    totalRequests: pagination.totalRequests,
    requestPagination: pagination,
    handlePageChange,

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

    managementTokenModalOpen,
    managementTokenRequest,
    managementTokenAction,
    managementTokenSubmitting,
    managementTokenError,
    handleManagementTokenSubmit,
    closeManagementTokenModal,
  };
}
