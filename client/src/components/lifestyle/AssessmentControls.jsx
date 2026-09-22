// client/src/components/lifestyle/AssessmentControls.jsx

// UI controls for managing lifestyle assessment actions.
// Toggles scoring details, triggers saves or resets, and displays status/error feedback.

// Controls UI component
export default function AssessmentControls({
  user,
  saving,
  showScoring,
  saveMessage,
  saveError,
  lifestyleError,
  onShowScoringChange,
  onSave,
  onReset,
}) {
  return (
    <section className="card">
      <div className="card-header">
        <h2 className="card-title">Assessment Controls</h2>

        <p className="text-sm text-slate-500 mt-1">
          Review your score details, save your assessment, or start again.
        </p>
      </div>

      <div className="card-content">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showScoring}
            onChange={(event) => onShowScoringChange(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />

          <span className="text-sm font-medium text-slate-700">
            Show scoring details
          </span>
        </label>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          {user && (
            <button
              type="button"
              className="btn-primary"
              onClick={onSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Assessment"}
            </button>
          )}

          <button type="button" className="btn-secondary" onClick={onReset}>
            Reset Assessment
          </button>
        </div>

        {/* Guest Warning */}
        {!user && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm text-slate-600">
              You can complete the assessment without logging in. Log in to save
              your result.
            </p>
          </div>
        )}

        {/* Success Alert */}
        {saveMessage && (
          <div
            className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3"
            role="status"
          >
            <p className="text-sm text-green-700">{saveMessage}</p>
          </div>
        )}

        {/* Error Alert */}
        {(saveError || lifestyleError) && (
          <div
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
            role="alert"
          >
            <p className="text-sm text-red-700">
              {saveError || lifestyleError}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
