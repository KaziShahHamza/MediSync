// client/src/components/dashboard/DashboardSummary.jsx

// Displays the AI-generated health summary along with rate-limiting timer controls,
// side-by-side with the lifestyle score assessment card.

import { useEffect, useState } from "react";
import { HeartPulse, RefreshCw } from "lucide-react";

import LifestyleScoreCard from "../health/LifestyleScoreCard";

const COOLDOWN_MS = 10 * 60 * 1000;

// Section layout component arranging AI summary and lifestyle score
export default function DashboardSummary({
  aiSummary,
  aiGeneratedAt,
  aiLoading,
  aiGenerating,
  aiMessage,
  onGenerateSummary,
  latestAssessment,
}) {
  return (
    <div className="grid xl:grid-cols-[6fr_4fr] gap-6">
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

// Component managing AI generation triggers, content display, and dynamic cooldown countdown
function AISummaryCard({
  summary,
  generatedAt,
  loading,
  generating,
  message,
  onGenerate,
}) {
  const [remainingTime, setRemainingTime] = useState(0);

  // Calculates and ticks down the remaining cooldown duration after generation
  useEffect(() => {
    if (!generatedAt) {
      setRemainingTime(0);
      return;
    }

    const updateCooldown = () => {
      const generatedTime = new Date(generatedAt).getTime();
      const cooldownEndsAt = generatedTime + COOLDOWN_MS;

      setRemainingTime(Math.max(0, cooldownEndsAt - Date.now()));
    };

    updateCooldown();

    const interval = setInterval(updateCooldown, 1000);

    return () => clearInterval(interval);
  }, [generatedAt]);

  const cooldownActive = remainingTime > 0;

  // Formats active cooldown time in minutes for display
  const formatRemainingTime = () => {
    const totalSeconds = Math.ceil(remainingTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);

    return `${minutes} minutes`;
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-5">
        <div className="icon-wrapper">
          <HeartPulse size={22} className="text-blue-600" />
        </div>

        <h3 className="card-title">AI Weekly Health Summary</h3>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading your health summary...</p>
      ) : summary ? (
        <p className="text-slate-600 leading-relaxed whitespace-pre-line">
          {summary}
        </p>
      ) : (
        <p className="text-slate-500">
          Generate a personalized health summary based on your available health
          data.
        </p>
      )}

      {message && <p className="text-sm text-red-600 mt-4">{message}</p>}

      {generatedAt && (
        <p className="text-xs text-slate-400 mt-5">
          Generated {new Date(generatedAt).toLocaleString()}
        </p>
      )}

      {/* Button and cooldown helper text */}
      <div className="mt-5">
        <button
          onClick={onGenerate}
          disabled={generating || cooldownActive}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <p className="text-xs text-slate-400 mt-2">
              Try again in {formatRemainingTime()}
            </p>

            <p className="text-xs text-slate-400 mt-2">
              To prevent excessive AI requests, you can generate another summary
              after the cooldown period.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
