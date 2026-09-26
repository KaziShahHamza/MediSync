// client/src/components/lifestyle/AssessmentControls.jsx

// Provides controls for managing lifestyle assessment actions.
// Displays save/reset actions along with success and error feedback.

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
        {/* Control whether detailed scoring information is displayed. */}
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

        {/* Render save and reset actions based on authentication state. */}
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

        {/* Explain why guests cannot persist their assessment. */}
        {!user && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm text-slate-600">
              You can complete the assessment without logging in. Log in to save
              your result.
            </p>
          </div>
        )}

        {/* Show successful save feedback when available. */}
        {saveMessage && (
          <div
            className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3"
            role="status"
          >
            <p className="text-sm text-green-700">{saveMessage}</p>
          </div>
        )}

        {/* Show either save or assessment errors to the user. */}
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
