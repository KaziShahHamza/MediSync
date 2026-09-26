// client/src/pages/BloodRequest.jsx

// Renders the blood request management page.
// Connects blood request state and actions to the request UI.

import { Droplets, Plus } from "lucide-react";

import BloodRequestList from "../components/blood/BloodRequestList";
import BloodRequestModal from "../components/blood/BloodRequestModal";

import useBloodRequests from "../hooks/blood-request/useBloodRequests";

// Provides blood request creation and management controls.
export default function BloodRequest() {
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
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <Droplets size={25} strokeWidth={2} />
        </div>

        <h1 className="page-title">Blood Request</h1>

        <p className="page-description max-w-2xl">
          Post a blood requirement and manage your active blood requests.
        </p>
      </div>

      {/* Provides the primary action for creating a blood request. */}
      <section className="card mb-8 p-6 lg:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Plus size={21} />
            </div>

            <div>
              <h2 className="card-title">Need Blood?</h2>

              <p className="text-muted mt-1 max-w-2xl text-sm">
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

      {/* Displays errors encountered while loading requests. */}
      {requestsError && (
        <div className="alert alert-danger mb-8">{requestsError}</div>
      )}

      {/* Displays existing blood requests and their actions. */}
      <BloodRequestList
        requests={bloodRequests}
        loading={requestsLoading}
        onEdit={handleEditRequest}
        onDelete={handleDeleteRequest}
        user={user}
        onCreate={openRequestModal}
      />

      {/* Displays the request form modal when active. */}
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
