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
  loading,
  message,
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

    return `${minutes} minutes`;
  };

  const isAISummaryCard = summary !== undefined;

  if (isAISummaryCard) {
    return (
      <article className="ms-card ms-dashboard-ai-card">
        <div className="ms-dashboard-ai-header">
          <div className="ms-dashboard-ai-heading">
            <div className="ms-icon-box ms-dashboard-ai-icon">
              <HeartPulse size={22} aria-hidden="true" />
            </div>

            <div>
              <span className="ms-dashboard-card-eyebrow">
                Personalized insight
              </span>

              <h3 className="ms-card-title">
                AI Weekly Health Summary
              </h3>
            </div>
          </div>

          <span className="ms-dashboard-ai-badge">AI</span>
        </div>

        <div className="ms-dashboard-ai-body">
          {loading ? (
            <div
              className="ms-dashboard-ai-loading"
              aria-label="Loading health summary"
            >
              <span className="ms-skeleton ms-dashboard-ai-skeleton-line" />
              <span className="ms-skeleton ms-dashboard-ai-skeleton-line" />
              <span className="ms-skeleton ms-dashboard-ai-skeleton-line-short" />
            </div>
          ) : summary ? (
            <p className="ms-dashboard-ai-summary">{summary}</p>
          ) : (
            <p className="ms-dashboard-ai-empty">
              Generate a personalized health summary based on your available
              health data.
            </p>
          )}

          {message && (
            <div className="ms-alert ms-alert-danger ms-dashboard-ai-alert">
              {message}
            </div>
          )}

          {generatedAt && !loading && (
            <p className="ms-dashboard-ai-generated">
              Generated {new Date(generatedAt).toLocaleString()}
            </p>
          )}
        </div>

        {onGenerate && !loading && (
          <div className="ms-dashboard-ai-footer">
            <button
              type="button"
              onClick={onGenerate}
              disabled={generating || cooldownActive}
              className="ms-btn ms-btn-secondary ms-dashboard-ai-button"
              title={
                cooldownActive
                  ? `Try again in ${formatRemainingTime()}`
                  : ""
              }
            >
              <RefreshCw
                size={16}
                aria-hidden="true"
                className={generating ? "ms-icon-spin" : ""}
              />

              <span>
                {generating
                  ? "Generating..."
                  : summary
                    ? "Generate New Summary"
                    : "Generate Summary"}
              </span>
            </button>

            {cooldownActive && (
              <div className="ms-dashboard-ai-cooldown">
                <p>Try again in {formatRemainingTime()}</p>

                <p>
                  To prevent excessive AI requests, you can generate another
                  summary after the cooldown period.
                </p>
              </div>
            )}
          </div>
        )}
      </article>
    );
  }

  return (
    <article className="ms-card ms-dashboard-health-card">
      <div className="ms-dashboard-health-card-top">
        <div className="ms-dashboard-health-content">
          <p className="ms-dashboard-health-label">{title}</p>

          <p className="ms-dashboard-health-value">
            {value || "No data"}
          </p>
        </div>

        <div className="ms-icon-box ms-dashboard-health-icon">
          <Icon size={22} aria-hidden="true" />
        </div>
      </div>

      {subtitle && (
        <p className="ms-dashboard-health-subtitle">{subtitle}</p>
      )}
    </article>
  );
}

