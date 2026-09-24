// client/src/pages/BloodRequest.jsx

// Renders the blood request page and connects request state to its UI components.
// Provides request creation, editing, deletion, and management controls.

import { Droplets, Plus } from "lucide-react";

import BloodRequestList from "../components/blood/BloodRequestList";
import BloodRequestModal from "../components/blood/BloodRequestModal";

import useBloodRequests from "../hooks/blood-request/useBloodRequests";

export default function BloodRequest() {
  // Loads blood request state and actions from the custom hook.
  const {
    user,

    bloodRequests,
    requestsLoading,
    requestsError,

    requestForm,
    handleRequestChange,

    requestUpazilas,
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
  } = useBloodRequests();

  return (
    <main className="container py-10 lg:py-14">
      {/* Page heading and blood request introduction. */}
      <div className="page-header">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 text-red-600 mb-4">
          <Droplets size={25} strokeWidth={2} />
        </div>

        <h1 className="page-title">Blood Request</h1>

        <p className="page-description max-w-2xl">
          Post a blood requirement and manage your active blood requests.
        </p>
      </div>
      {/* Provides the primary action for creating a new request. */}
      <section className="card p-6 lg:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <Plus size={21} />
            </div>

            <div>
              <h2 className="card-title">Need Blood?</h2>

              <p className="text-sm text-muted mt-1 max-w-2xl">
                Post a blood requirement and let available donors find you. No
                account is required.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openRequestModal}
            className="btn-primary"
          >
            <Plus size={17} />
            Post Blood Request
          </button>
        </div>
      </section>
      {/* Displays errors that occur while loading blood requests. */}
      {requestsError && (
        <div className="alert alert-danger mb-8">{requestsError}</div>
      )}
      {/* Displays the active blood request list and its actions. */}
      <BloodRequestList
        requests={bloodRequests}
        loading={requestsLoading}
        onEdit={handleEditRequest}
        onDelete={handleDeleteRequest}
        user={user}
        onCreate={openRequestModal}
      />
      {/* Displays the request form modal when it is open. */}
      {requestModalOpen && (
        <BloodRequestModal
          user={user}
          editingRequest={editingRequest}
          requestForm={requestForm}
          requestUpazilas={requestUpazilas}
          hospitalSelectValue={hospitalSelectValue}
          requestError={requestError}
          requestSuccess={requestSuccess}
          requestSubmitting={requestSubmitting}
          managementToken={managementToken}
          copied={copied}
          onRequestChange={handleRequestChange}
          onHospitalChange={handleHospitalChange}
          onSubmit={submitBloodRequest}
          onCopyToken={copyManagementToken}
          onClose={closeRequestModal}
        />
      )}
    </main>
  );
}
