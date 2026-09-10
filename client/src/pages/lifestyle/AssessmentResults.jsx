import React from "react";

export function AssessmentResult({ categoryResults, totalScore, feedback }) {
  return (
    <section className="card">
      <div className="result-heading-row">
        <div>
          <h2 className="section-title" style={{ marginBottom: "6px" }}>
            Assessment Result
          </h2>
          <p className="section-description" style={{ marginBottom: 0 }}>
            Your score is based on the relative importance of each lifestyle
            category. It is an indicator of daily habits, not a medical
            diagnosis.
          </p>
        </div>

        <div className="result-total-score">
          <span className="result-total-label">Total Score</span>
          <strong>{totalScore}</strong>
          <span>/ 100</span>
        </div>
      </div>

      <div className="results-grid">
        {Object.entries(categoryResults).map(([category, result]) => (
          <div key={category} className="result-metric-card">
            <div className="result-metric-title">{category}</div>

            <strong className="result-metric-value">
              {result.score} / {result.max}
            </strong>

            <div className="result-category-progress">
              <div
                className="result-category-progress-fill"
                style={{
                  width: `${result.max > 0
                    ? Math.min(100, (result.score / result.max) * 100)
                    : 0}%`,
                }}
              />
            </div>

            <div className="result-category-percentage">
              {result.max > 0
                ? `${Math.round((result.score / result.max) * 100)}%`
                : "0%"}
            </div>
          </div>
        ))}
      </div>

      <div className="feedback-container">
        <div className="result-metric-title" style={{ marginBottom: "6px" }}>
          Feedback
        </div>

        <p className="feedback-text">{feedback}</p>
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
      <h2 className="section-title" style={{ marginBottom: "16px" }}>
        Score Classification
      </h2>

      <div className="grades-grid">
        {GRADES.map(([letter, range, description]) => (
          <div key={letter} className="grade-card">
            <strong className="grade-letter">{letter}</strong>
            <span className="grade-range">{range}</span>
            <span className="grade-description">{description}</span>
          </div>
        ))}
      </div>
    </section>
  );
}