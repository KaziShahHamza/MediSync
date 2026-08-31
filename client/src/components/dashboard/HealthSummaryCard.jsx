// client/src/components/dashboard/HealthSummaryCard.jsx

import { useEffect, useState } from "react";
import { HeartPulse, RefreshCw } from "lucide-react";

const COOLDOWN_MS = 10 * 60 * 1000;

export default function HealthSummaryCard({
  title,
  value,
  subtitle,
  summary,
  generatedAt,
  onGenerate,
  generating,
  icon: Icon = HeartPulse,
}) {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (!generatedAt) {
      setRemainingTime(0);
      return;
    }

    const updateCooldown = () => {
      const generatedTime = new Date(generatedAt).getTime();
      const cooldownEndsAt = generatedTime + COOLDOWN_MS;

      const remaining = Math.max(0, cooldownEndsAt - Date.now());

      setRemainingTime(remaining);
    };

    updateCooldown();

    const interval = setInterval(updateCooldown, 1000);

    return () => clearInterval(interval);
  }, [generatedAt]);

  const cooldownActive = remainingTime > 0;

  const formatRemainingTime = () => {
    const totalSeconds = Math.ceil(remainingTime / 1000);

    const minutes = Math.floor(totalSeconds / 60);

    // const seconds = totalSeconds % 60;

    return `${minutes} minutes`;
  };

  return (
    <div className="card">
      {summary !== undefined ? (
        <>
          <div className="flex items-center gap-3 mb-5">
            <div className="icon-wrapper">
              <HeartPulse size={22} className="text-blue-600" />
            </div>

            <h3 className="card-title">AI Health Summary</h3>
          </div>

          {summary ? (
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {summary}
            </p>
          ) : (
            <p className="text-slate-500">
              Generate a personalized health summary based on your available
              health data.
            </p>
          )}

          {generatedAt && (
            <p className="text-xs text-slate-400 mt-5">
              Generated {new Date(generatedAt).toLocaleString()}
            </p>
          )}

          {onGenerate && (
            <>
              <div className="mt-5">
                <button
                  onClick={onGenerate}
                  disabled={generating || cooldownActive}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={
                    cooldownActive
                      ? `Try again in ${formatRemainingTime()}`
                      : ""
                  }
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

                {cooldownActive && (
                  <>
                    <p className="text-xs text-slate-400 mt-2">
                      Try again in {formatRemainingTime()}{" "}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      {" "}
                      To prevent excessive AI requests, you can generate another
                      summary after the cooldown period.{" "}
                    </p>
                  </>
                )}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-500">{title}</h3>

              <p className="text-3xl font-bold text-slate-900 mt-3">
                {value || "No data"}
              </p>
            </div>

            <div className="icon-wrapper">
              <Icon size={22} className="text-blue-600" />
            </div>
          </div>

          {subtitle && (
            <p className="mt-4 text-sm text-slate-500">{subtitle}</p>
          )}
        </>
      )}
    </div>
  );
}
