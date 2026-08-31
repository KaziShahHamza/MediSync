// client/src/components/dashboard/HealthSummaryCard.jsx

import { HeartPulse, RefreshCw } from "lucide-react";

export default function HealthSummaryCard({
  title,
  value,
  subtitle,
  summary,
  icon: Icon = HeartPulse,
  loading = false,
  generating = false,
  generatedAt,
  message,
  onGenerate,
}) {
  // AI Summary Card
  if (loading || summary || message || onGenerate) {
    return (
      <div className="card">
        {" "}
        <div className="flex items-center gap-3 mb-5">
          {" "}
          <div className="icon-wrapper">
            {" "}
            <HeartPulse size={22} className="text-blue-600" />{" "}
          </div>
          <h3 className="card-title">AI Health Summary</h3>
        </div>
        {loading ? (
          <div>
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-11/12" />
              <div className="h-4 bg-slate-200 rounded w-9/12" />
            </div>

            <p className="text-sm text-slate-500 mt-5">
              Analyzing your health information...
            </p>
          </div>
        ) : (
          <>
            {summary ? (
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {summary}
              </p>
            ) : (
              <p className="text-slate-500 leading-relaxed">
                {message ||
                  "Add health information to receive personalized AI insights."}
              </p>
            )}

            {generatedAt && (
              <p className="text-xs text-slate-400 mt-5">
                Generated {new Date(generatedAt).toLocaleString()}
              </p>
            )}

            {onGenerate && (
              <button
                onClick={onGenerate}
                disabled={generating}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  size={16}
                  className={generating ? "animate-spin" : ""}
                />

                {generating
                  ? "Generating..."
                  : summary
                    ? "Generate New Summary"
                    : "Generate Summary"}
              </button>
            )}
          </>
        )}
      </div>
    );
  }

  // Normal Health Metric Card
  return (
    <div className="card">
      {" "}
      <div className="flex items-start justify-between">
        {" "}
        <div>
          {" "}
          <h3 className="text-sm font-medium text-slate-500">{title} </h3>
          <p className="text-3xl font-bold text-slate-900 mt-3">
            {value || "No data"}
          </p>
        </div>
        <div className="icon-wrapper">
          <Icon size={22} className="text-blue-600" />
        </div>
      </div>
      {subtitle && <p className="mt-4 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}
