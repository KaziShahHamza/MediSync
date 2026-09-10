import { Activity, CheckCircle2 } from "lucide-react";

export function AssessmentResult({
  categoryResults,
  totalScore,
  grade,
  feedback,
}) {
  return (
    <section className="card">
      <div className="card-header">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="icon-wrapper">
                <Activity size={22} className="text-blue-600" />
              </div>

              <h2 className="section-title">Assessment Result</h2>
            </div>

            <p className="text-sm text-slate-500 mt-3 max-w-2xl">
              Your score reflects your lifestyle habits across the assessed
              health categories. It is an indicator of daily habits, not a
              medical diagnosis.
            </p>
          </div>

          <div className="text-right shrink-0">
            <p className="small-label">Total Score</p>

            <div className="flex items-baseline justify-end gap-1 mt-1">
              <strong className="text-4xl font-bold text-slate-900">
                {totalScore}
              </strong>

              <span className="text-sm text-slate-500">
                / 100
              </span>
            </div>

            <span className="badge badge-success mt-2 inline-flex">
              Grade {grade}
            </span>
          </div>
        </div>
      </div>

      <div className="card-content">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(categoryResults).map(([category, result]) => {
            const percentage =
              result.max > 0
                ? Math.round((result.score / result.max) * 100)
                : 0;

            return (
              <div
                key={category}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-slate-700">
                    {category}
                  </p>

                  <CheckCircle2
                    size={18}
                    className="text-blue-600 shrink-0"
                  />
                </div>

                <div className="flex items-baseline gap-1 mt-4">
                  <strong className="text-2xl font-bold text-slate-900">
                    {result.score}
                  </strong>

                  <span className="text-sm text-slate-500">
                    / {result.max}
                  </span>
                </div>

                <div className="mt-3 h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.max(0, percentage))}%`,
                    }}
                  />
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  {percentage}% of category score
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
          <p className="small-label">Feedback</p>

          <p className="text-sm leading-6 text-slate-600 mt-2">
            {feedback}
          </p>
        </div>
      </div>
    </section>
  );
}

export function GradeReference() {
  const GRADES = [
    ["A+", "80–100", "Excellent"],
    ["A", "70–79", "Very good"],
    ["A-", "60–69", "Good"],
    ["B", "50–59", "Needs improvement"],
    ["C", "0–49", "Focus on healthy changes"],
  ];

  return (
    <section className="card">
      <div className="card-header">
        <h2 className="section-title">Score Classification</h2>

        <p className="text-sm text-slate-500 mt-2">
          Use these ranges to understand your overall lifestyle score.
        </p>
      </div>

      <div className="card-content">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {GRADES.map(([letter, range, description]) => (
            <div
              key={letter}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center"
            >
              <strong className="block text-2xl font-bold text-slate-900">
                {letter}
              </strong>

              <span className="block text-sm font-medium text-slate-700 mt-1">
                {range}
              </span>

              <span className="block text-xs text-slate-500 mt-2">
                {description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

