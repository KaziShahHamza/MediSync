// client/src/components/blood/BloodRequestModal.jsx

// Renders the modal used to create or edit blood requests.
// Displays request status messages and embeds the blood request form.

import { AlertCircle, CheckCircle2, X } from "lucide-react";

import ManagementTokenNotice from "./ManagementTokenNotice";
import BloodRequestForm from "./BloodRequestForm";

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
  // Detect clicks directly on the modal backdrop.
  const handleOverlayMouseDown = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Determine the modal title from the current operation.
  const modalTitle = editingRequest
    ? "Edit Blood Request"
    : "Post Blood Request";

  // Determine the submit button label from request state.
  const submitLabel = requestSubmitting
    ? editingRequest
      ? "Updating..."
      : "Posting..."
    : editingRequest
      ? "Update Request"
      : "Post Blood Request";

  return (
    <div className="modal-overlay" onMouseDown={handleOverlayMouseDown}>
      {/* Render the scrollable modal dialog and header. */}
      <div className="modal max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="modal-header sticky top-0 bg-white z-10">
          <div>
            <h2 className="card-title">{modalTitle}</h2>

            <p className="text-sm text-muted mt-1">
              Provide the details so donors can reach the right place.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-icon"
            disabled={requestSubmitting}
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          {/* Render validation and submission status messages. */}
          <div className="modal-body">
            {requestError && (
              <div className="alert alert-danger mb-6">
                <div className="flex items-start gap-2">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />

                  <span>{requestError}</span>
                </div>
              </div>
            )}

            {requestSuccess && (
              <div className="mb-6">
                {requestSuccess.managementToken ? (
                  <ManagementTokenNotice
                    managementToken={requestSuccess.managementToken}
                    copied={copied}
                    onCopy={onCopyToken}
                  />
                ) : (
                  <div className="alert alert-success">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={19} className="shrink-0 mt-0.5" />

                      <p className="font-medium">{requestSuccess.message}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Delegate request field rendering to the form component. */}
            <BloodRequestForm
              user={user}
              requestForm={requestForm}
              requestUpazilas={requestUpazilas}
              hospitalSelectValue={hospitalSelectValue}
              onRequestChange={onRequestChange}
              onHospitalChange={onHospitalChange}
            />
          </div>

          {/* Keep modal actions available at the bottom while scrolling. */}
          <div className="modal-footer sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={requestSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={requestSubmitting}
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
