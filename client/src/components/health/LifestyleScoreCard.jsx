import { Activity, ArrowRight, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

function getScoreStatus(score) {
  if (score >= 80) {
    return {
      label: "Excellent",
      badgeClass: "badge-success",
    };
  }

  if (score >= 70) {
    return {
      label: "Very Good",
      badgeClass: "badge-success",
    };
  }

  if (score >= 60) {
    return {
      label: "Good",
      badgeClass: "badge-warning",
    };
  }

  if (score >= 50) {
    return {
      label: "Needs Improvement",
      badgeClass: "badge-warning",
    };
  }

  return {
    label: "Needs Attention",
    badgeClass: "badge-danger",
  };
}

export default function LifestyleScoreCard({ assessment }) {
  const navigate = useNavigate();

  if (!assessment) {
    return (
      <div className="card h-full">
        <div className="card-header">
          <div className="flex items-center gap-3">
            <div className="icon-wrapper">
              <Activity size={22} className="text-blue-600" />
            </div>

            <div>
              <h3 className="card-title">Lifestyle Score</h3>
              <p className="text-sm text-slate-500 mt-1">
                Understand your daily health habits.
              </p>
            </div>
          </div>
        </div>

        <div className="card-content flex flex-col items-center justify-center text-center min-h-48">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Activity size={26} className="text-slate-400" />
          </div>

          <h4 className="font-semibold text-slate-800">
            No assessment yet
          </h4>

          <p className="text-sm text-slate-500 mt-2 max-w-sm">
            Complete your Lifestyle Score assessment to see how your daily
            habits are affecting your overall lifestyle score.
          </p>

          <button
            type="button"
            className="btn-primary mt-5"
            onClick={() => navigate("/lifestyle")}
          >
            Take Assessment
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    );
  }

  const score = Number(assessment.totalScore) || 0;
  const status = getScoreStatus(score);

  return (
    <div className="card h-full">
      <div className="card-header">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="icon-wrapper">
              <Activity size={22} className="text-blue-600" />
            </div>

            <div>
              <h3 className="card-title">Lifestyle Score</h3>
              <p className="text-sm text-slate-500 mt-1">
                Latest assessment
              </p>
            </div>
          </div>

          <span className={`badge ${status.badgeClass}`}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="card-content">
        <div className="flex items-end gap-2">
          <span className="text-5xl font-bold text-slate-900">
            {score}
          </span>

          <span className="text-lg text-slate-500 mb-1">
            / 100
          </span>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Trophy size={17} className="text-blue-600" />

          <span className="text-sm font-medium text-slate-700">
            Grade {assessment.grade}
          </span>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">
              Overall lifestyle score
            </span>

            <span className="text-sm font-semibold text-slate-700">
              {score}%
            </span>
          </div>

          <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.max(0, score))}%`,
              }}
            />
          </div>
        </div>

        {assessment.assessedAt && (
          <p className="text-xs text-slate-400 mt-4">
            Assessed on{" "}
            {new Date(assessment.assessedAt).toLocaleDateString()}
          </p>
        )}

        <button
          type="button"
          className="btn-secondary w-full mt-5"
          onClick={() => navigate("/lifestyle")}
        >
          View Lifestyle Score
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}

