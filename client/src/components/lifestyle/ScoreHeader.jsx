import React from "react";
export default function Header() {
  return (
    <header className="card">
      {" "}
      <div className="card-content">
        {" "}
        <p className="small-label">MediSync Lifestyle Assessment</p>{" "}
        <h2 className="section-title mt-2"> Lifestyle Score </h2>{" "}
        <p className="text-sm leading-6 text-slate-600 mt-3 max-w-3xl">
          {" "}
          Complete the questionnaire based on your usual daily habits. Your
          score is a lifestyle indicator and is not a medical diagnosis or
          clinical health assessment.{" "}
        </p>{" "}
      </div>{" "}
    </header>
  );
}
export function StickyScoreBar({
  totalScore,
  grade,
  answeredCount,
  totalQuestions,
}) {
  const safeScore = Math.max(0, Math.min(100, Number(totalScore) || 0));
  return (
    <section className="card">
      {" "}
      <div className="card-content">
        {" "}
        <div className="flex items-center justify-between gap-6">
          {" "}
          {/* Score */}{" "}
          <div>
            {" "}
            <p className="small-label"> Current Lifestyle Score </p>{" "}
            <div className="flex items-baseline gap-2 mt-1">
              {" "}
              <span className="text-4xl sm:text-5xl font-bold text-slate-900">
                {" "}
                {safeScore}{" "}
              </span>{" "}
              <span className="text-sm text-slate-500"> / 100 </span>{" "}
            </div>{" "}
          </div>{" "}
          {/* Grade */}{" "}
          <div className="text-right">
            {" "}
            <p className="small-label">Grade</p>{" "}
            <span className="inline-flex items-center justify-center min-w-14 h-10 px-3 rounded-xl bg-blue-50 text-blue-700 text-xl font-bold mt-1">
              {" "}
              {grade}{" "}
            </span>{" "}
          </div>{" "}
        </div>{" "}
        {/* Progress */}{" "}
        <div className="mt-6">
          {" "}
          <div
            className="h-2.5 rounded-full bg-slate-100 overflow-hidden"
            role="progressbar"
            aria-valuenow={safeScore}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {" "}
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${safeScore}%` }}
            />{" "}
          </div>{" "}
        </div>{" "}
        {/* Answered count */}{" "}
        <div className="flex items-center justify-between mt-3">
          {" "}
          <span className="text-xs text-slate-500">
            {" "}
            Assessment progress{" "}
          </span>{" "}
          <span className="text-xs font-medium text-slate-600">
            {" "}
            {answeredCount} of {totalQuestions} questions answered{" "}
          </span>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  );
}
