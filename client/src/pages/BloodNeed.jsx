import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  Clock,
  Droplets,
  Hospital,
  MapPin,
  Phone,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  Pencil,
  X,
  CheckCircle2,
  Copy,
  ShieldCheck,
} from "lucide-react";

import { districtsData } from "../data/districtsData";
import hospitalsData from "../data/hospitalsData";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

const OTHER_HOSPITAL = "__other__";

const EMPTY_FORM = {
  bloodGroup: "",
  bagsNeeded: "1",
  compensationOffered: "",
  district: "",
  upazila: "",
  hospitalName: "",
  hospitalAddress: "",
  contactPhone: "",
  requesterName: "",
  notes: "",
};

function getDeviceId() {
  const STORAGE_KEY =
    "medisync_blood_request_device_id";

  let deviceId =
    localStorage.getItem(STORAGE_KEY);

  if (!deviceId) {
    deviceId =
      crypto.randomUUID();

    localStorage.setItem(
      STORAGE_KEY,
      deviceId,
    );
  }

  return deviceId;
}

function formatTimeAgo(dateString) {
  const date =
    new Date(dateString);

  const diff =
    Date.now() - date.getTime();

  const minutes = Math.floor(
    diff / 60000,
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} minute${
      minutes !== 1 ? "s" : ""
    } ago`;
  }

  const hours = Math.floor(
    minutes / 60,
  );

  if (hours < 24) {
    return `${hours} hour${
      hours !== 1 ? "s" : ""
    } ago`;
  }

  return "Recently";
}

function formatExpiry(dateString) {
  const expiresAt =
    new Date(dateString);

  const diff =
    expiresAt.getTime() -
    Date.now();

  if (diff <= 0) {
    return "Expired";
  }

  const minutes = Math.ceil(
    diff / 60000,
  );

  if (minutes < 60) {
    return `Expires in ${minutes} min`;
  }

  const hours = Math.ceil(
    minutes / 60,
  );

  return `Expires in ${hours} hr`;
}

export default function BloodNeed() {
  const { user } = useAuth();

  // ========================================================
  // Donor Search State
  // ========================================================

  const [
    bloodGroup,
    setBloodGroup,
  ] = useState("");

  const [
    district,
    setDistrict,
  ] = useState("");

  const [
    upazila,
    setUpazila,
  ] = useState("");

  const [
    compensation,
    setCompensation,
  ] = useState("");

  const [donors, setDonors] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [
    searched,
    setSearched,
  ] = useState(false);

  const [error, setError] =
    useState("");

  // ========================================================
  // Blood Request State
  // ========================================================

  const [
    requestForm,
    setRequestForm,
  ] = useState(EMPTY_FORM);

  const [
    requestModalOpen,
    setRequestModalOpen,
  ] = useState(false);

  const [
    requestSubmitting,
    setRequestSubmitting,
  ] = useState(false);

  const [
    requestError,
    setRequestError,
  ] = useState("");

  const [
    requestSuccess,
    setRequestSuccess,
  ] = useState(null);

  const [
    bloodRequests,
    setBloodRequests,
  ] = useState([]);

  const [
    requestsLoading,
    setRequestsLoading,
  ] = useState(false);

  const [
    requestsError,
    setRequestsError,
  ] = useState("");

  const [
    editingRequest,
    setEditingRequest,
  ] = useState(null);

  const [
    managementToken,
    setManagementToken,
  ] = useState("");

  const [
    copied,
    setCopied,
  ] = useState(false);

  // ========================================================
  // Location Data
  // ========================================================

  const selectedDistrict =
    useMemo(
      () =>
        districtsData.find(
          (item) =>
            item.name ===
            requestForm.district,
        ),
      [requestForm.district],
    );

  const requestUpazilas =
    selectedDistrict?.upazilas || [];

  const selectedHospitalList =
    hospitalsData[
      requestForm.district
    ] || [];

  // ========================================================
  // Donor Search Location
  // ========================================================

  const selectedSearchDistrict =
    useMemo(
      () =>
        districtsData.find(
          (item) =>
            item.name === district,
        ),
      [district],
    );

  const upazilas =
    selectedSearchDistrict?.upazilas ||
    [];

  useEffect(() => {
    setUpazila("");
  }, [district]);

  // ========================================================
  // Request Form Location
  // ========================================================

  useEffect(() => {
    setRequestForm(
      (previous) => ({
        ...previous,
        upazila: "",
        hospitalName: "",
        hospitalAddress: "",
      }),
    );
  }, [requestForm.district]);

  // ========================================================
  // Device ID
  // ========================================================

  useEffect(() => {
    getDeviceId();
  }, []);

  // ========================================================
  // Donor Search
  // ========================================================

  const fetchDonors = async () => {
    try {
      setLoading(true);
      setError("");

      const params =
        new URLSearchParams();

      if (bloodGroup) {
        params.set(
          "bloodGroup",
          bloodGroup,
        );
      }

      if (district) {
        params.set(
          "district",
          district,
        );
      }

      if (upazila) {
        params.set(
          "upazila",
          upazila,
        );
      }

      if (compensation) {
        params.set(
          "compensation",
          compensation,
        );
      }

      const queryString =
        params.toString();

      const url = queryString
        ? `${API_URL}/api/blood/donors?${queryString}`
        : `${API_URL}/api/blood/donors`;

      const response =
        await fetch(url);

      if (!response.ok) {
        throw new Error(
          "Failed to find blood donors.",
        );
      }

      const data =
        await response.json();

      setDonors(
        data.donors || [],
      );

      setSearched(true);
    } catch (err) {
      console.error(
        "Blood donor search failed:",
        err,
      );

      setDonors([]);

      setError(
        err.message ||
          "Unable to search for blood donors.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (
    event,
  ) => {
    event.preventDefault();

    fetchDonors();
  };

  const handleReset = () => {
    setBloodGroup("");
    setDistrict("");
    setUpazila("");
    setCompensation("");
    setDonors([]);
    setError("");
    setSearched(false);
  };

  // ========================================================
  // Blood Requests
  // ========================================================

  const fetchBloodRequests =
    async () => {
      try {
        setRequestsLoading(
          true,
        );

        setRequestsError("");

        const response =
          await fetch(
            `${API_URL}/api/blood/requests`,
          );

        if (!response.ok) {
          throw new Error(
            "Failed to load blood requests.",
          );
        }

        const data =
          await response.json();

        setBloodRequests(
          data.requests || [],
        );
      } catch (err) {
        console.error(
          "Blood request fetch failed:",
          err,
        );

        setRequestsError(
          err.message ||
            "Unable to load blood requests.",
        );
      } finally {
        setRequestsLoading(
          false,
        );
      }
    };

  useEffect(() => {
    fetchBloodRequests();

    const interval =
      setInterval(
        fetchBloodRequests,
        60000,
      );

    return () =>
      clearInterval(interval);
  }, []);

  // ========================================================
  // Request Form
  // ========================================================

  const handleRequestChange = (
    event,
  ) => {
    const {
      name,
      value,
    } = event.target;

    setRequestForm(
      (previous) => ({
        ...previous,
        [name]: value,
      }),
    );
  };

  const handleHospitalChange = (
    event,
  ) => {
    const value =
      event.target.value;

    if (value === OTHER_HOSPITAL) {
      setRequestForm(
        (previous) => ({
          ...previous,
          hospitalName: "",
          hospitalAddress: "",
        }),
      );

      return;
    }

    const hospital =
      selectedHospitalList.find(
        (item) =>
          item.name === value,
      );

    setRequestForm(
      (previous) => ({
        ...previous,
        hospitalName:
          hospital?.name || "",
        hospitalAddress:
          hospital?.address || "",
      }),
    );
  };

  const isHospitalFromList =
    selectedHospitalList.some(
      (hospital) =>
        hospital.name ===
        requestForm.hospitalName,
    );

  const hospitalSelectValue =
    isHospitalFromList
      ? requestForm.hospitalName
      : OTHER_HOSPITAL;

  const resetRequestForm = () => {
    setRequestForm(
      EMPTY_FORM,
    );

    setRequestError("");

    setEditingRequest(null);
  };

  const openRequestModal =
    () => {
      resetRequestForm();

      setRequestSuccess(null);

      setRequestModalOpen(true);
    };

  const closeRequestModal =
    () => {
      if (requestSubmitting) {
        return;
      }

      setRequestModalOpen(false);

      resetRequestForm();
    };

  // ========================================================
  // Create / Update Request
  // ========================================================

  const submitBloodRequest =
    async (event) => {
      event.preventDefault();

      try {
        setRequestSubmitting(
          true,
        );

        setRequestError("");

        const deviceId =
          getDeviceId();

        const token =
          localStorage.getItem(
            "token",
          );

        const body = {
          bloodGroup:
            requestForm.bloodGroup,

          bagsNeeded:
            Number(
              requestForm.bagsNeeded,
            ),

          compensationOffered:
            requestForm.compensationOffered ===
            "yes",

          district:
            requestForm.district,

          upazila:
            requestForm.upazila,

          hospitalName:
            requestForm.hospitalName,

          hospitalAddress:
            requestForm.hospitalAddress,

          contactPhone:
            requestForm.contactPhone,

          requesterName:
            requestForm.requesterName,

          notes:
            requestForm.notes,

          deviceId,
        };

        // Public users need their private token
        // for editing/deleting later.
        if (
          !user &&
          managementToken
        ) {
          body.managementToken =
            managementToken;
        }

        const url =
          editingRequest
            ? `${API_URL}/api/blood/requests/${editingRequest.id}`
            : `${API_URL}/api/blood/requests`;

        const response =
          await fetch(url, {
            method:
              editingRequest
                ? "PUT"
                : "POST",

            headers: {
              "Content-Type":
                "application/json",

              ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                  }
                : {}),
            },

            body: JSON.stringify(
              body,
            ),
          });

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to submit blood request.",
          );
        }

        if (editingRequest) {
          setBloodRequests(
            (previous) =>
              previous.map(
                (request) =>
                  request.id ===
                  editingRequest.id
                    ? data.request
                    : request,
              ),
          );

          setRequestSuccess({
            type: "updated",
            message:
              "Your blood request was updated successfully.",
          });

          setEditingRequest(
            null,
          );

          setRequestForm(
            EMPTY_FORM,
          );

          return;
        }

        // Public user's management token.
        if (
          data.managementToken
        ) {
          localStorage.setItem(
            `medisync_blood_request_token_${data.request.id}`,
            data.managementToken,
          );

          setManagementToken(
            data.managementToken,
          );
        }

        setRequestSuccess({
          type: "created",
          message:
            "Your blood request has been posted successfully.",
          request:
            data.request,
          managementToken:
            data.managementToken,
        });

        setRequestForm(
          EMPTY_FORM,
        );

        await fetchBloodRequests();
      } catch (err) {
        console.error(
          "Blood request submission failed:",
          err,
        );

        setRequestError(
          err.message ||
            "Unable to submit blood request.",
        );
      } finally {
        setRequestSubmitting(
          false,
        );
      }
    };

  // ========================================================
  // Edit Request
  // ========================================================

  const handleEditRequest =
    (request) => {
      const savedToken =
        localStorage.getItem(
          `medisync_blood_request_token_${request.id}`,
        );

      // Logged-in users can edit through JWT.
      // Public users need their private token.
      if (!user && !savedToken) {
        setRequestError(
          "You do not have the management access for this request.",
        );

        return;
      }

      setManagementToken(
        savedToken || "",
      );

      setEditingRequest(
        request,
      );

      const matchingHospital =
        (
          hospitalsData[
            request.district
          ] || []
        ).find(
          (hospital) =>
            hospital.name ===
            request.hospital?.name,
        );

      setRequestForm({
        bloodGroup:
          request.bloodGroup,

        bagsNeeded:
          String(
            request.bagsNeeded,
          ),

        compensationOffered:
          request.compensationOffered
            ? "yes"
            : "no",

        district:
          request.district,

        upazila:
          request.upazila,

        hospitalName:
          request.hospital?.name ||
          "",

        hospitalAddress:
          request.hospital?.address ||
          "",

        contactPhone:
          request.contactPhone ||
          "",

        requesterName:
          request.requesterName ||
          "",

        notes:
          request.notes || "",
      });

      setRequestError("");

      setRequestSuccess(null);

      setRequestModalOpen(true);
    };

  // ========================================================
  // Delete Request
  // ========================================================

  const handleDeleteRequest =
    async (request) => {
      const savedToken =
        localStorage.getItem(
          `medisync_blood_request_token_${request.id}`,
        );

      if (!user && !savedToken) {
        window.alert(
          "You do not have permission to delete this request.",
        );

        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this blood request?",
        );

      if (!confirmed) {
        return;
      }

      try {
        const token =
          localStorage.getItem(
            "token",
          );

        const response =
          await fetch(
            `${API_URL}/api/blood/requests/${request.id}`,
            {
              method: "DELETE",

              headers: {
                "Content-Type":
                  "application/json",

                ...(token
                  ? {
                      Authorization: `Bearer ${token}`,
                    }
                  : {}),
              },

              body: JSON.stringify({
                managementToken:
                  savedToken || "",
              }),
            },
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to delete blood request.",
          );
        }

        setBloodRequests(
          (previous) =>
            previous.filter(
              (item) =>
                item.id !==
                request.id,
            ),
        );

        localStorage.removeItem(
          `medisync_blood_request_token_${request.id}`,
        );
      } catch (err) {
        console.error(
          "Blood request deletion failed:",
          err,
        );

        window.alert(
          err.message ||
            "Unable to delete blood request.",
        );
      }
    };

  // ========================================================
  // Copy Management Token
  // ========================================================

  const copyManagementToken =
    async () => {
      if (!managementToken) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          managementToken,
        );

        setCopied(true);

        setTimeout(
          () => setCopied(false),
          2000,
        );
      } catch {
        setCopied(false);
      }
    };

  // ========================================================
  // Render
  // ========================================================

  return (
    <main className="container py-10 lg:py-14">
      {/* ====================================================
          Page Header
      ==================================================== */}

      <div className="page-header">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sky-50 text-sky-600 mb-4">
          <Droplets
            size={25}
            strokeWidth={2}
          />
        </div>

        <h1 className="page-title">
          Blood Need
        </h1>

        <p className="page-description max-w-2xl">
          Find blood donors in your
          area or post a blood request
          when someone needs urgent
          help.
        </p>
      </div>

      {/* ====================================================
          Post Request CTA
      ==================================================== */}

      <section className="card p-6 lg:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <Plus size={21} />
            </div>

            <div>
              <h2 className="card-title">
                Need Blood?
              </h2>

              <p className="text-sm text-muted mt-1 max-w-2xl">
                Post a blood requirement
                and let available donors
                find you. No account is
                required.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={
              openRequestModal
            }
            className="btn-primary"
          >
            <Plus size={17} />
            Post Blood Request
          </button>
        </div>
      </section>

      {/* ====================================================
          Donor Search
      ==================================================== */}

      <section className="card p-6 lg:p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Search size={20} />
          </div>

          <div>
            <h2 className="card-title">
              Find a Blood Donor
            </h2>

            <p className="text-sm text-muted mt-1">
              Search by blood group,
              location, and compensation.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Blood Group */}

            <div>
              <label
                htmlFor="blood-group"
                className="small-label block mb-2"
              >
                Blood Group
              </label>

              <select
                id="blood-group"
                value={bloodGroup}
                onChange={(event) =>
                  setBloodGroup(
                    event.target.value,
                  )
                }
                className="input"
              >
                <option value="">
                  All blood groups
                </option>

                {BLOOD_GROUPS.map(
                  (group) => (
                    <option
                      key={group}
                      value={group}
                    >
                      {group}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* District */}

            <div>
              <label
                htmlFor="district"
                className="small-label block mb-2"
              >
                District
              </label>

              <select
                id="district"
                value={district}
                onChange={(event) =>
                  setDistrict(
                    event.target.value,
                  )
                }
                className="input"
              >
                <option value="">
                  All districts
                </option>

                {districtsData.map(
                  (item) => (
                    <option
                      key={item.name}
                      value={item.name}
                    >
                      {item.name}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* Upazila */}

            <div>
              <label
                htmlFor="upazila"
                className="small-label block mb-2"
              >
                Upazila
              </label>

              <select
                id="upazila"
                value={upazila}
                onChange={(event) =>
                  setUpazila(
                    event.target.value,
                  )
                }
                disabled={!district}
                className="input disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">
                  {district
                    ? "All upazilas"
                    : "Select district first"}
                </option>

                {upazilas.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* Compensation */}

            <div>
              <label
                htmlFor="compensation"
                className="small-label block mb-2"
              >
                Will you Provide travel
                cost? (সম্মানী)
              </label>

              <select
                id="compensation"
                value={compensation}
                onChange={(event) =>
                  setCompensation(
                    event.target.value,
                  )
                }
                className="input"
              >
                <option value="">
                  Any
                </option>

                <option value="yes">
                  Yes
                </option>

                <option value="no">
                  No
                </option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              <Search size={17} />

              {loading
                ? "Searching..."
                : "Find Donors"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary"
              disabled={loading}
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </form>
      </section>

      {/* ====================================================
          Errors
      ==================================================== */}

      {error && (
        <div className="alert alert-danger mb-8">
          {error}
        </div>
      )}

      {requestsError && (
        <div className="alert alert-danger mb-8">
          {requestsError}
        </div>
      )}

      {/* ====================================================
          Active Blood Requests
      ==================================================== */}

      <section className="mb-10">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              Blood Requests
            </h2>

            <p className="text-sm text-muted mt-1">
              Active requests from people
              who currently need blood.
            </p>
          </div>
        </div>

        {requestsLoading ? (
          <div className="card p-8 text-center">
            <p className="text-sm text-muted">
              Loading blood requests...
            </p>
          </div>
        ) : bloodRequests.length >
          0 ? (
          <div className="table-container">
            <div className="hidden lg:grid lg:grid-cols-[1fr_1fr_1.5fr_1.8fr_1fr_1fr] gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200">
              <p className="small-label">
                Blood
              </p>

              <p className="small-label">
                Bags
              </p>

              <p className="small-label">
                Location
              </p>

              <p className="small-label">
                Hospital
              </p>

              <p className="small-label">
                Posted
              </p>

              <p className="small-label text-right">
                Contact
              </p>
            </div>

            <div className="divide-y divide-slate-200">
              {bloodRequests.map(
                (request) => {
                  const savedToken =
                    localStorage.getItem(
                      `medisync_blood_request_token_${request.id}`,
                    );

                  const canManage =
                    Boolean(
                      savedToken,
                    ) ||
                    Boolean(
                      user &&
                        request.hasAccount,
                    );

                  return (
                    <div
                      key={request.id}
                      className="px-5 py-5 md:px-6"
                    >
                      {/* Desktop */}

                      <div className="hidden lg:grid lg:grid-cols-[1fr_1fr_1.5fr_1.8fr_1fr_1fr] gap-4 items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                            <Droplets
                              size={19}
                            />
                          </div>

                          <div>
                            <p className="text-lg font-bold text-slate-900">
                              {
                                request.bloodGroup
                              }
                            </p>

                            <p className="text-xs text-slate-500">
                              Blood group
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {
                              request.bagsNeeded
                            }{" "}
                            bag
                            {request.bagsNeeded !==
                            1
                              ? "s"
                              : ""}
                          </p>

                          <span
                            className={`badge mt-1 ${
                              request.compensationOffered
                                ? "badge-success"
                                : ""
                            }`}
                          >
                            {request.compensationOffered
                              ? "Travel cost offered"
                              : "No compensation"}
                          </span>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {
                              request.district
                            }
                          </p>

                          <p className="text-xs text-muted mt-1">
                            {
                              request.upazila
                            }
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {
                              request
                                .hospital
                                ?.name
                            }
                          </p>

                          <p className="text-xs text-muted mt-1 line-clamp-2">
                            {
                              request
                                .hospital
                                ?.address
                            }
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            {formatTimeAgo(
                              request.createdAt,
                            )}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            {formatExpiry(
                              request.expiresAt,
                            )}
                          </p>
                        </div>

                        <div className="flex justify-end">
                          <a
                            href={`tel:${request.contactPhone}`}
                            className="btn-primary"
                          >
                            <Phone
                              size={16}
                            />
                            Call
                          </a>
                        </div>
                      </div>

                      {/* Mobile */}

                      <div className="lg:hidden">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                              <Droplets
                                size={20}
                              />
                            </div>

                            <div>
                              <p className="text-xl font-bold text-slate-900">
                                {
                                  request.bloodGroup
                                }
                              </p>

                              <p className="text-xs text-slate-500">
                                {
                                  request.bagsNeeded
                                }{" "}
                                bag
                                {request.bagsNeeded !==
                                1
                                  ? "s"
                                  : ""}
                              </p>
                            </div>
                          </div>

                          <span className="text-xs text-slate-400">
                            {formatTimeAgo(
                              request.createdAt,
                            )}
                          </span>
                        </div>

                        <div className="mt-5 space-y-4">
                          <div>
                            <p className="small-label">
                              Location
                            </p>

                            <p className="text-sm font-medium text-slate-800 mt-1">
                              {
                                request.district
                              }
                              {" • "}
                              {
                                request.upazila
                              }
                            </p>
                          </div>

                          <div>
                            <p className="small-label">
                              Hospital
                            </p>

                            <p className="text-sm font-semibold text-slate-800 mt-1">
                              {
                                request
                                  .hospital
                                  ?.name
                              }
                            </p>

                            <p className="text-xs text-muted mt-1">
                              {
                                request
                                  .hospital
                                  ?.address
                              }
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`badge ${
                                request.compensationOffered
                                  ? "badge-success"
                                  : ""
                              }`}
                            >
                              {request.compensationOffered
                                ? "Travel cost offered"
                                : "No compensation"}
                            </span>

                            <span className="badge">
                              <Clock
                                size={13}
                              />

                              {formatExpiry(
                                request.expiresAt,
                              )}
                            </span>
                          </div>
                        </div>

                        <a
                          href={`tel:${request.contactPhone}`}
                          className="btn-primary w-full mt-5"
                        >
                          <Phone
                            size={17}
                          />
                          Call Requester
                        </a>
                      </div>

                      {/* Management */}

                      {canManage && (
                        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() =>
                              handleEditRequest(
                                request,
                              )
                            }
                            className="btn-secondary h-10 px-4"
                          >
                            <Pencil
                              size={15}
                            />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteRequest(
                                request,
                              )
                            }
                            className="btn-danger h-10 px-4"
                          >
                            <Trash2
                              size={15}
                            />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Droplets
                size={25}
              />
            </div>

            <h3 className="empty-state-title">
              No active blood requests
            </h3>

            <p className="empty-state-description">
              If someone needs blood,
              you can post a request
              and let nearby donors
              know.
            </p>

            <div className="empty-state-actions">
              <button
                type="button"
                onClick={
                  openRequestModal
                }
                className="btn-primary"
              >
                <Plus size={17} />
                Post Blood Request
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ====================================================
          Donor Results
      ==================================================== */}

      {searched &&
        !loading &&
        !error && (
          <section>
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="section-title text-xl">
                  Available Donors
                </h2>

                <p className="text-sm text-muted mt-1">
                  {donors.length} donor
                  {donors.length !==
                  1
                    ? "s"
                    : ""}{" "}
                  found.
                </p>
              </div>
            </div>

            {donors.length > 0 ? (
              <div className="card overflow-hidden">
                <div className="hidden md:grid md:grid-cols-[1.2fr_1.5fr_1.5fr_1.2fr] gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200">
                  <p className="small-label">
                    Blood Group
                  </p>

                  <p className="small-label">
                    District
                  </p>

                  <p className="small-label">
                    Upazila
                  </p>

                  <p className="small-label text-right">
                    Contact
                  </p>
                </div>

                <div className="divide-y divide-slate-200">
                  {donors.map(
                    (
                      donor,
                      index,
                    ) => (
                      <div
                        key={`${donor.bloodGroup}-${donor.district}-${donor.upazila}-${index}`}
                        className="px-5 py-5 md:px-6"
                      >
                        <div className="hidden md:grid md:grid-cols-[1.2fr_1.5fr_1.5fr_1.2fr] gap-4 items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                              <Droplets
                                size={19}
                              />
                            </div>

                            <span className="text-lg font-bold text-slate-900">
                              {
                                donor.bloodGroup
                              }
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin
                              size={17}
                              className="text-slate-400 shrink-0"
                            />

                            <span className="text-sm font-medium text-slate-800">
                              {
                                donor.district
                              }
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin
                              size={17}
                              className="text-slate-400 shrink-0"
                            />

                            <span className="text-sm font-medium text-slate-800">
                              {
                                donor.upazila
                              }
                            </span>
                          </div>

                          <div className="flex justify-end">
                            <a
                              href={`tel:${donor.bloodDonationContactNumber}`}
                              className="btn-primary"
                            >
                              <Phone
                                size={16}
                              />
                              Contact
                            </a>
                          </div>
                        </div>

                        <div className="md:hidden">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                              <Droplets
                                size={20}
                              />
                            </div>

                            <div>
                              <p className="text-xs text-slate-500">
                                Blood Group
                              </p>

                              <p className="text-xl font-bold text-slate-900">
                                {
                                  donor.bloodGroup
                                }
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-slate-500">
                                District
                              </p>

                              <p className="text-sm font-medium text-slate-800 mt-1">
                                {
                                  donor.district
                                }
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-500">
                                Upazila
                              </p>

                              <p className="text-sm font-medium text-slate-800 mt-1">
                                {
                                  donor.upazila
                                }
                              </p>
                            </div>
                          </div>

                          <a
                            href={`tel:${donor.bloodDonationContactNumber}`}
                            className="btn-primary w-full mt-5"
                          >
                            <Phone
                              size={17}
                            />
                            Contact Donor
                          </a>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Droplets
                    size={22}
                  />
                </div>

                <h3 className="empty-state-title">
                  No donors found
                </h3>

                <p className="empty-state-description">
                  No available donors
                  match your selected
                  blood group, location,
                  and compensation
                  preference.
                </p>
              </div>
            )}
          </section>
        )}

      {/* ====================================================
          Blood Request Modal
      ==================================================== */}

      {requestModalOpen && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeRequestModal();
            }
          }}
        >
          <div className="modal max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="modal-header sticky top-0 bg-white z-10">
              <div>
                <h2 className="card-title">
                  {editingRequest
                    ? "Edit Blood Request"
                    : "Post Blood Request"}
                </h2>

                <p className="text-sm text-muted mt-1">
                  Provide the details so
                  donors can reach the
                  right place.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeRequestModal
                }
                className="btn-icon"
                disabled={
                  requestSubmitting
                }
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={
                submitBloodRequest
              }
            >
              <div className="modal-body">
                {requestError && (
                  <div className="alert alert-danger mb-6">
                    <div className="flex items-start gap-2">
                      <AlertCircle
                        size={18}
                        className="shrink-0 mt-0.5"
                      />

                      <span>
                        {
                          requestError
                        }
                      </span>
                    </div>
                  </div>
                )}

                {requestSuccess && (
                  <div className="alert alert-success mb-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        size={19}
                        className="shrink-0 mt-0.5"
                      />

                      <div>
                        <p className="font-medium">
                          {
                            requestSuccess.message
                          }
                        </p>

                        {requestSuccess.managementToken && (
                          <div className="mt-4">
                            <p className="text-xs mb-2">
                              Save this private
                              management code.
                              You can use it to
                              manage your request
                              if you are not logged
                              in.
                            </p>

                            <div className="flex gap-2">
                              <input
                                value={
                                  requestSuccess.managementToken
                                }
                                readOnly
                                className="input text-xs font-mono"
                              />

                              <button
                                type="button"
                                onClick={
                                  copyManagementToken
                                }
                                className="btn-secondary shrink-0"
                              >
                                <Copy
                                  size={16}
                                />

                                {copied
                                  ? "Copied"
                                  : "Copy"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Basic Request */}

                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="icon-wrapper">
                      <Droplets
                        size={19}
                        className="icon-primary"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Blood Requirement
                      </h3>

                      <p className="text-xs text-muted mt-0.5">
                        What blood is needed?
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="request-blood-group"
                        className="block mb-2"
                      >
                        Blood Group *
                      </label>

                      <select
                        id="request-blood-group"
                        name="bloodGroup"
                        value={
                          requestForm.bloodGroup
                        }
                        onChange={
                          handleRequestChange
                        }
                        className="input"
                        required
                      >
                        <option value="">
                          Select blood group
                        </option>

                        {BLOOD_GROUPS.map(
                          (group) => (
                            <option
                              key={group}
                              value={group}
                            >
                              {group}
                            </option>
                          ),
                        )}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="bags-needed"
                        className="block mb-2"
                      >
                        Number of Bags *
                      </label>

                      <input
                        id="bags-needed"
                        name="bagsNeeded"
                        type="number"
                        min="1"
                        max="20"
                        step="1"
                        value={
                          requestForm.bagsNeeded
                        }
                        onChange={
                          handleRequestChange
                        }
                        className="input"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label
                      htmlFor="compensation-offered"
                      className="block mb-2"
                    >
                      Will you provide
                      honorarium / travel cost? *
                    </label>

                    <select
                      id="compensation-offered"
                      name="compensationOffered"
                      value={
                        requestForm.compensationOffered
                      }
                      onChange={
                        handleRequestChange
                      }
                      className="input"
                      required
                    >
                      <option value="">
                        Select
                      </option>

                      <option value="yes">
                        Yes
                      </option>

                      <option value="no">
                        No
                      </option>
                    </select>
                  </div>
                </div>

                {/* Location */}

                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="icon-wrapper">
                      <MapPin
                        size={19}
                        className="icon-primary"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Location
                      </h3>

                      <p className="text-xs text-muted mt-0.5">
                        Where is the blood needed?
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="request-district"
                        className="block mb-2"
                      >
                        District *
                      </label>

                      <select
                        id="request-district"
                        name="district"
                        value={
                          requestForm.district
                        }
                        onChange={
                          handleRequestChange
                        }
                        className="input"
                        required
                      >
                        <option value="">
                          Select district
                        </option>

                        {districtsData.map(
                          (item) => (
                            <option
                              key={item.name}
                              value={
                                item.name
                              }
                            >
                              {item.name}
                            </option>
                          ),
                        )}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="request-upazila"
                        className="block mb-2"
                      >
                        Upazila *
                      </label>

                      <select
                        id="request-upazila"
                        name="upazila"
                        value={
                          requestForm.upazila
                        }
                        onChange={
                          handleRequestChange
                        }
                        disabled={
                          !requestForm.district
                        }
                        className="input disabled:bg-slate-100 disabled:text-slate-400"
                        required
                      >
                        <option value="">
                          {requestForm.district
                            ? "Select upazila"
                            : "Select district first"}
                        </option>

                        {requestUpazilas.map(
                          (item) => (
                            <option
                              key={item}
                              value={item}
                            >
                              {item}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Hospital */}

                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="icon-wrapper">
                      <Hospital
                        size={19}
                        className="icon-primary"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Hospital
                      </h3>

                      <p className="text-xs text-muted mt-0.5">
                        Where should donors go?
                      </p>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="hospital"
                      className="block mb-2"
                    >
                      Hospital *
                    </label>

                    <select
                      id="hospital"
                      value={
                        hospitalSelectValue
                      }
                      onChange={
                        handleHospitalChange
                      }
                      disabled={
                        !requestForm.district
                      }
                      className="input disabled:bg-slate-100 disabled:text-slate-400"
                      required
                    >
                      <option value="">
                        {requestForm.district
                          ? "Select hospital"
                          : "Select district first"}
                      </option>

                      {selectedHospitalList.map(
                        (hospital) => (
                          <option
                            key={
                              hospital.name
                            }
                            value={
                              hospital.name
                            }
                          >
                            {
                              hospital.name
                            }
                          </option>
                        ),
                      )}

                      <option
                        value={
                          OTHER_HOSPITAL
                        }
                      >
                        Other / Hospital not listed
                      </option>
                    </select>
                  </div>

                  {hospitalSelectValue ===
                    OTHER_HOSPITAL && (
                    <div className="grid md:grid-cols-2 gap-5 mt-5">
                      <div>
                        <label
                          htmlFor="hospital-name"
                          className="block mb-2"
                        >
                          Hospital Name *
                        </label>

                        <input
                          id="hospital-name"
                          name="hospitalName"
                          type="text"
                          value={
                            requestForm.hospitalName
                          }
                          onChange={
                            handleRequestChange
                          }
                          className="input"
                          placeholder="Enter hospital name"
                          maxLength="200"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="hospital-address"
                          className="block mb-2"
                        >
                          Hospital Address *
                        </label>

                        <input
                          id="hospital-address"
                          name="hospitalAddress"
                          type="text"
                          value={
                            requestForm.hospitalAddress
                          }
                          onChange={
                            handleRequestChange
                          }
                          className="input"
                          placeholder="Enter hospital address"
                          maxLength="500"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {hospitalSelectValue !==
                    OTHER_HOSPITAL &&
                    requestForm.hospitalName && (
                      <div className="surface-muted p-4 mt-4">
                        <p className="text-sm font-semibold text-slate-800">
                          {
                            requestForm.hospitalName
                          }
                        </p>

                        <p className="text-xs text-muted mt-1">
                          {
                            requestForm.hospitalAddress
                          }
                        </p>
                      </div>
                    )}
                </div>

                {/* Contact */}

                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="icon-wrapper">
                      <Phone
                        size={19}
                        className="icon-primary"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Contact Information
                      </h3>

                      <p className="text-xs text-muted mt-0.5">
                        Donors will use this number
                        to contact you.
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block mb-2"
                      >
                        Contact Phone *
                      </label>

                      <input
                        id="contact-phone"
                        name="contactPhone"
                        type="tel"
                        value={
                          requestForm.contactPhone
                        }
                        onChange={
                          handleRequestChange
                        }
                        className="input"
                        placeholder="01XXXXXXXXX"
                        maxLength="30"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="requester-name"
                        className="block mb-2"
                      >
                        Requester Name
                      </label>

                      <input
                        id="requester-name"
                        name="requesterName"
                        type="text"
                        value={
                          requestForm.requesterName
                        }
                        onChange={
                          handleRequestChange
                        }
                        className="input"
                        placeholder="Optional"
                        maxLength="100"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}

                <div>
                  <label
                    htmlFor="request-notes"
                    className="block mb-2"
                  >
                    Additional Information
                  </label>

                  <textarea
                    id="request-notes"
                    name="notes"
                    value={
                      requestForm.notes
                    }
                    onChange={
                      handleRequestChange
                    }
                    className="input min-h-28"
                    placeholder="Any additional information donors should know..."
                    maxLength="1000"
                  />
                </div>

                {/* Public notice */}

                {!user && (
                  <div className="surface-muted p-4 mt-6">
                    <div className="flex items-start gap-3">
                      <ShieldCheck
                        size={19}
                        className="text-blue-600 shrink-0 mt-0.5"
                      />

                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          No account required
                        </p>

                        <p className="text-xs text-muted mt-1">
                          You can post this request
                          without signing up. After
                          posting, we will give you a
                          private management code so
                          you can edit or delete your
                          request.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={
                    closeRequestModal
                  }
                  className="btn-secondary"
                  disabled={
                    requestSubmitting
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={
                    requestSubmitting
                  }
                >
                  {requestSubmitting
                    ? "Posting..."
                    : editingRequest
                      ? "Update Request"
                      : "Post Blood Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}