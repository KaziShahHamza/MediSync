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
  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* ==================================================
            Header
        ================================================== */}

        <div className="modal-header sticky top-0 bg-white z-10">
          <div>
            <h2 className="card-title">
              {editingRequest ? "Edit Blood Request" : "Post Blood Request"}
            </h2>

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
          <div className="modal-body">
            {/* ==================================================
                Error
            ================================================== */}

            {requestError && (
              <div className="alert alert-danger mb-6">
                <div className="flex items-start gap-2">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />

                  <span>{requestError}</span>
                </div>
              </div>
            )}

            {/* ==================================================
                Success
            ================================================== */}

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

            {/* ==================================================
                Form
            ================================================== */}

            <BloodRequestForm
              user={user}
              requestForm={requestForm}
              requestUpazilas={requestUpazilas}
              hospitalSelectValue={hospitalSelectValue}
              onRequestChange={onRequestChange}
              onHospitalChange={onHospitalChange}
            />
          </div>

          {/* ==================================================
              Footer
          ================================================== */}

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
