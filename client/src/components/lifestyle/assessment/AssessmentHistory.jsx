// client/src/components/lifestyle/AssessmentHistory.jsx

// Displays the latest saved lifestyle assessment.
// Provides a chronological list of the user's last 7 saved assessments.

function LatestAssessment({ assessment }) {
  // Hide the latest-assessment card when no saved result exists.
  if (!assessment) {
    return null;
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="card-title">Latest Saved Assessment</h2>

            <p className="mt-1 text-sm text-slate-500">
              Your most recently saved lifestyle assessment.
            </p>
          </div>

          <span className="badge badge-success">Grade {assessment.grade}</span>
        </div>
      </div>

      <div className="card-content">
        <div className="flex items-end gap-2">
          <strong className="text-4xl font-bold text-slate-900">
            {assessment.totalScore}
          </strong>

          <span className="mb-1 text-sm text-slate-500">/ 100</span>
        </div>

        {assessment.assessedAt && (
          <p className="mt-3 text-sm text-slate-500">
            Saved on {new Date(assessment.assessedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}

function HistoryList({ assessments }) {
  // Avoid rendering an empty history card when no records exist.
  if (!assessments?.length) {
    return null;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Assessment History</h2>

        {/* <p className="mt-1 text-sm text-slate-500">
          Your saved Lifestyle Score assessments.
        </p> */}

        <p className="mt-2 text-xs font-medium text-slate-400">
          Showing your last 7 scores
        </p>
      </div>

      <div className="card-content">
        {/* Render each saved assessment as a compact history row. */}
        <div className="divide-y divide-slate-200">
          {assessments.map((assessment) => (
            <div
              key={assessment._id}
              className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-baseline gap-1">
                  <strong className="text-xl font-bold text-slate-900">
                    {assessment.totalScore}
                  </strong>

                  <span className="text-sm text-slate-500">/ 100</span>
                </div>

                <span className="badge badge-success">
                  Grade {assessment.grade}
                </span>
              </div>

              <span className="text-sm text-slate-500">
                {assessment.assessedAt
                  ? new Date(assessment.assessedAt).toLocaleDateString()
                  : "Unknown date"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AssessmentHistory({ latestAssessment, assessments }) {
  // Skip the complete history section when no assessment data exists.
  if (!latestAssessment && !assessments?.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      <LatestAssessment assessment={latestAssessment} />

      <HistoryList assessments={assessments} />
    </div>
  );
}
