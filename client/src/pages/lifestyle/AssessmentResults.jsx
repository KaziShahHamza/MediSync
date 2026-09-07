import React from "react";

export function AssessmentResult({ categoryResults, totalScore, getFeedback }) {
  return (
    <section className="card">
      <h2 className="section-title" style={{ marginBottom: "20px" }}>
        Assessment Result
      </h2>

      <div className="results-grid">
        {Object.entries(categoryResults).map(([category, result]) => (
          <div key={category} className="result-metric-card">
            <div className="result-metric-title">{category}</div>
            <strong className="result-metric-value">
              {result.score} / {result.max}
            </strong>
          </div>
        ))}
      </div>

      <div className="feedback-container">
        <div className="result-metric-title" style={{ marginBottom: "6px" }}>
          Feedback
        </div>
        <p className="feedback-text">{getFeedback(totalScore)}</p>
      </div>
    </section>
  );
}

export function GradeReference() {
  const GRADES = [
    ["A+", "90–100"],
    ["A", "80–89"],
    ["A-", "70–79"],
    ["B", "60–69"],
    ["C", "0–59"],
  ];

  return (
    <section className="card">
      <h2 className="section-title" style={{ marginBottom: "16px" }}>
        Score Classification
      </h2>
      <div className="grades-grid">
        {GRADES.map(([letter, range]) => (
          <div key={letter} className="grade-card">
            <strong className="grade-letter">{letter}</strong>
            <span className="grade-range">{range}</span>
          </div>
        ))}
      </div>
    </section>
  );
}