// client/src/components/dashboard/DashboardSummary.jsx

// Displays the AI health summary beside the lifestyle score assessment.
// Handles AI summary cooldown timing and generation controls.

import { useEffect, useState } from "react";
import { HeartPulse, RefreshCw } from "lucide-react";

import LifestyleScoreCard from "../health/LifestyleScoreCard";

const COOLDOWN_MS = 10 * 60 * 1000;

// Render the AI summary and lifestyle assessment side by side.
export default function DashboardSummary({
  aiSummary,
  aiGeneratedAt,
  aiLoading,
  aiGenerating,
  aiMessage,
  onGenerateSummary,
  latestAssessment,
}) {
  // Keep dashboard cards independent so each section manages its own state.
  return (
    <div className="grid gap-6 xl:grid-cols-[6fr_4fr]">
      <AISummaryCard
        summary={aiSummary}
        generatedAt={aiGeneratedAt}
        loading={aiLoading}
        generating={aiGenerating}
        message={aiMessage}
        onGenerate={onGenerateSummary}
      />

      <LifestyleScoreCard assessment={latestAssessment} />
    </div>
  );
}

// Manage AI summary rendering, generation state, and cooldown timing.
function AISummaryCard({
  summary,
  generatedAt,
  loading,
  generating,
  message,
  onGenerate,
}) {
  const [now, setNow] = useState(() => Date.now());

  // Update the current timestamp while a summary cooldown is active.
  useEffect(() => {
    if (!generatedAt) {
      return undefined;
    }

    // Refresh the clock once per second for the visible countdown.
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    // Stop the timer when the generated timestamp changes or the card unmounts.
    return () => clearInterval(interval);
  }, [generatedAt]);

  const generatedTime = generatedAt ? new Date(generatedAt).getTime() : 0;

  const cooldownEndsAt = generatedTime + COOLDOWN_MS;

  // Derive the remaining cooldown directly from the current timestamp.
  const remainingTime = generatedAt ? Math.max(0, cooldownEndsAt - now) : 0;

  const cooldownActive = remainingTime > 0;

  // Format the remaining cooldown duration for the interface.
  const formatRemainingTime = () => {
    const totalSeconds = Math.ceil(remainingTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);

    return `${minutes} minutes`;
  };

  return (
    <div className="card">
      <div className="mb-5 flex items-center gap-3">
        <div className="icon-wrapper">
          <HeartPulse size={22} className="text-blue-600" />
        </div>

        <h3 className="card-title">AI Weekly Health Summary</h3>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading your health summary...</p>
      ) : summary ? (
        <p className="leading-relaxed whitespace-pre-line text-slate-600">
          {summary}
        </p>
      ) : (
        <p className="text-slate-500">
          Generate a personalized health summary based on your available health
          data.
        </p>
      )}

      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}

      {generatedAt && (
        <p className="mt-5 text-xs text-slate-400">
          Generated {new Date(generatedAt).toLocaleString()}
        </p>
      )}

      <div className="mt-5">
        <button
          type="button"
          onClick={onGenerate}
          disabled={generating || cooldownActive}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          title={cooldownActive ? `Try again in ${formatRemainingTime()}` : ""}
        >
          <RefreshCw size={16} className={generating ? "animate-spin" : ""} />

          {generating
            ? "Generating..."
            : summary
              ? "Generate New Summary"
              : "Generate Summary"}
        </button>

        {cooldownActive && (
          <>
            <p className="mt-2 text-xs text-slate-400">
              Try again in {formatRemainingTime()}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              To prevent excessive AI requests, you can generate another summary
              after the cooldown period.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
