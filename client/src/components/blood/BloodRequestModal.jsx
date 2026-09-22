// client/src/components/blood/BloodRequestModal.jsx
// Modal component for creating or editing a blood request. Provides overlay, headers, error/success notifications, and embedded request form.

import { AlertCircle, CheckCircle2, X } from "lucide-react";

import ManagementTokenNotice from "./ManagementTokenNotice";
import BloodRequestForm from "./BloodRequestForm";

// Modal component wrapping blood request creation/editing form
export default function BloodRequestModal({
  user,
  editingRequest,

  requestForm,
  requestUpazilas,
  hospitalSelectValue,

  requestError,
  requestSuccess,
  requestSubmitting,

  managementToken,
  copied,

  onRequestChange,
  onHospitalChange,
  onSubmit,
  onCopyToken,
  onClose,
}) {
  return (
    // Modal overlay container with backdrop click detection
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        // Close modal when clicking directly on overlay background
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Modal dialog wrapper */}
      <div className="modal max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Sticky modal header with title and close button */}
        <div className="modal-header sticky top-0 bg-white z-10">
          <div>
            <h2 className="card-title">
              {editingRequest ? "Edit Blood Request" : "Post Blood Request"}
            </h2>

            <p className="text-sm text-muted mt-1">
              Provide the details so donors can reach the right place.
            </p>
          </div>

          {/* Close modal button */}
          <button
            type="button"
            onClick={onClose}
            className="btn-icon"
            disabled={requestSubmitting}
          >
            <X size={19} />
          </button>
        </div>

        {/* Form container wrapping modal body and actions */}
        <form onSubmit={onSubmit}>
          <div className="modal-body">
            {/* Error alert banner */}
            {requestError && (
              <div className="alert alert-danger mb-6">
                <div className="flex items-start gap-2">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />

                  <span>{requestError}</span>
                </div>
              </div>
            )}

            {/* Success alert banner or management token viewer */}
            {requestSuccess && (
              <div className="mb-6">
                {requestSuccess.managementToken ? (
                  // Management token display card
                  <ManagementTokenNotice
                    managementToken={requestSuccess.managementToken}
                    copied={copied}
                    onCopy={onCopyToken}
                  />
                ) : (
                  // Standard success alert
                  <div className="alert alert-success">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={19} className="shrink-0 mt-0.5" />

                      <p className="font-medium">{requestSuccess.message}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Main form input fields component */}
            <BloodRequestForm
              user={user}
              requestForm={requestForm}
              requestUpazilas={requestUpazilas}
              hospitalSelectValue={hospitalSelectValue}
              onRequestChange={onRequestChange}
              onHospitalChange={onHospitalChange}
            />
          </div>

          {/* Sticky modal footer actions */}
          <div className="modal-footer sticky bottom-0 bg-white">
            {/* Cancel action button */}
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={requestSubmitting}
            >
              Cancel
            </button>

            {/* Submit action button */}
            <button
              type="submit"
              className="btn-primary"
              disabled={requestSubmitting}
            >
              {requestSubmitting
                ? editingRequest
                  ? "Updating..."
                  : "Posting..."
                : editingRequest
                  ? "Update Request"
                  : "Post Blood Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
