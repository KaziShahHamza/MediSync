import React from "react";

export default function Header() {
  return (
    <header className="card header-card">
      <div className="header-subtitle">MediSync Lifestyle Assessment</div>

      <h1 className="header-title">Lifestyle Score</h1>

      <p className="header-description">
        Complete the following questionnaire based on your usual daily habits.
        Your score is a lifestyle indicator and is not a medical diagnosis or
        clinical health assessment.
      </p>
    </header>
  );
}

export  function StickyScoreBar({
  totalScore,
  grade,
  answeredCount,
  totalQuestions,
}) {
  const safeScore = Math.max(0, Math.min(100, Number(totalScore) || 0));

  return (
    <section className="card sticky-score-bar">
      <div className="score-summary-header">
        <div>
          <div className="label-caps">Current Lifestyle Score</div>

          <div className="score-display-wrapper">
            <span className="score-main">{safeScore}</span>
            <span className="score-max">/ 100</span>
          </div>
        </div>

        <div className="text-right">
          <div className="label-caps">Grade</div>
          <div className="grade-display">{grade}</div>
        </div>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={safeScore}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="progress-fill"
          style={{ width: `${safeScore}%` }}
        />
      </div>

      <div className="answered-status">
        {answeredCount} of {totalQuestions} questions answered
      </div>
    </section>
  );
}