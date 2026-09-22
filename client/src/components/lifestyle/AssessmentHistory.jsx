// client/src/components/lifestyle/AssessmentHistory.jsx

// Displays previous lifestyle assessment records including the most recent score
// and an aggregate history list of past assessments.

// Renders the most recently saved assessment details
function LatestAssessment({ assessment }) {
  if (!assessment) {
    return null;
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="card-title">Latest Saved Assessment</h2>

            <p className="text-sm text-slate-500 mt-1">
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

          <span className="text-sm text-slate-500 mb-1">/ 100</span>
        </div>

        {assessment.assessedAt && (
          <p className="text-sm text-slate-500 mt-3">
            Saved on {new Date(assessment.assessedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}

// Renders the list of historical lifestyle assessment records
function HistoryList({ assessments }) {
  if (!assessments?.length) {
    return null;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Assessment History</h2>

        <p className="text-sm text-slate-500 mt-1">
          Your saved Lifestyle Score assessments.
        </p>
      </div>

      <div className="card-content">
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

// Container component for latest and historical assessment views
export default function AssessmentHistory({ latestAssessment, assessments }) {
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
