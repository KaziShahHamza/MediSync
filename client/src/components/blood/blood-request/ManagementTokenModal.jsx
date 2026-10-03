// client/src/components/blood/blood-request/ManagementTokenModal.jsx

// Renders a secure modal for entering a blood request management token.
// Verifies the token before allowing guest request management actions.

import { AlertCircle, KeyRound, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function ManagementTokenModal({
  request,
  action,
  submitting,
  error,
  onSubmit,
  onClose,
}) {
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken("");
  }, [request?.id]);

  if (!request) {
    return null;
  }

  const actionLabel = action === "delete" ? "delete" : "edit";

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit(token);
  };

  return (
    <div className="modal-overlay">
      <div className="modal max-w-md">
        <div className="modal-header">
          <div>
            <div className="flex items-center gap-2">
              <KeyRound size={19} className="text-red-600" />

              <h2 className="card-title">Management Access</h2>
            </div>

            <p className="text-sm text-muted mt-1">
              Enter the management token for this blood request to {actionLabel}{" "}
              it.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-icon"
            disabled={submitting}
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger mb-5">
                <div className="flex items-start gap-2">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />

                  <span>{error}</span>
                </div>
              </div>
            )}

            <label
              htmlFor="blood-request-management-token"
              className="input-label"
            >
              Management Token
            </label>

            <input
              id="blood-request-management-token"
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Enter your management token"
              className="input mt-2"
              autoFocus
              autoComplete="off"
              disabled={submitting}
              required
            />

            <p className="text-xs text-muted mt-2">
              Use the management token shown when this request was created.
            </p>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={submitting || !token.trim()}
            >
              {submitting ? "Verifying..." : "Verify Token"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
