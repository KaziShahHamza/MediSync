// src/pages/lifestyle/LifestyleScore.jsx

import { useMemo, useState } from "react";
import { Activity } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useLifestyle } from "../../context/LifestyleContext";

import Header, { StickyScoreBar } from "./ScoreHeader";

import { DemoSelector, Questionnaire } from "./QuestionnaireSection";

import { AssessmentResult, GradeReference } from "./AssessmentResults";

import { QUESTIONS, DEMO_USERS } from "./lifestyleQuestions";

import { getGrade, getFeedback } from "./lifestyleScoring";

export default function LifestyleScore() {
  const { user } = useAuth();

  const {
    latestAssessment,
    assessments,
    saving,
    error: lifestyleError,
    saveAssessment,
  } = useLifestyle();

  const [answers, setAnswers] = useState({});
  const [showScoring, setShowScoring] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const categories = useMemo(() => {
    return [...new Set(QUESTIONS.map((question) => question.category))];
  }, []);

  const categoryResults = useMemo(() => {
    const results = {};

    categories.forEach((category) => {
      const categoryQuestions = QUESTIONS.filter(
        (question) => question.category === category,
      );

      let rawScore = 0;
      let maxRawScore = 0;

      categoryQuestions.forEach((question) => {
        let highestPossible = 0;

        if (question.type === "multi") {
          const maxSelections = question.maxSelections ?? 3;

          highestPossible = question.options
            .map((option) => option.points)
            .sort((a, b) => b - a)
            .slice(0, maxSelections)
            .reduce((sum, points) => sum + points, 0);
        } else {
          highestPossible = Math.max(
            ...question.options.map((option) => option.points),
          );
        }

        maxRawScore += highestPossible;

        const selectedValue = answers[question.id];

        if (question.type === "multi") {
          if (Array.isArray(selectedValue)) {
            selectedValue.forEach((selectedLabel) => {
              const selectedOption = question.options.find(
                (option) => option.label === selectedLabel,
              );

              if (selectedOption) {
                rawScore += selectedOption.points;
              }
            });
          }
        } else if (selectedValue) {
          const selectedOption = question.options.find(
            (option) => option.label === selectedValue,
          );

          if (selectedOption) {
            rawScore += selectedOption.points;
          }
        }
      });

      results[category] = {
        score: rawScore,
        max: maxRawScore,
        rawScore,
        maxRawScore,
      };
    });

    return results;
  }, [answers, categories]);

  const totalScore = useMemo(() => {
    return Math.round(
      Object.values(categoryResults).reduce(
        (total, result) => total + result.score,
        0,
      ),
    );
  }, [categoryResults]);

  const grade = useMemo(() => {
    return getGrade(totalScore);
  }, [totalScore]);

  const feedback = useMemo(() => {
    return getFeedback(totalScore);
  }, [totalScore]);

  const answeredCount = useMemo(() => {
    return QUESTIONS.filter((question) => {
      const value = answers[question.id];

      if (question.type === "multi") {
        return Array.isArray(value) && value.length > 0;
      }

      return Boolean(value);
    }).length;
  }, [answers]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: value,
    }));

    setSaveMessage("");
    setSaveError("");
  };

  const loadDemo = (demoName) => {
    const selectedDemo = DEMO_USERS[demoName];

    if (!selectedDemo) {
      return;
    }

    setAnswers(selectedDemo);
    setSaveMessage("");
    setSaveError("");
  };

  const resetAssessment = () => {
    setAnswers({});
    setShowScoring(false);
    setSaveMessage("");
    setSaveError("");
  };

  const handleSaveAssessment = async () => {
    if (!user) {
      setSaveError("Please log in to save your lifestyle assessment.");
      setSaveMessage("");
      return;
    }

    if (answeredCount === 0) {
      setSaveError("Please answer at least one question before saving.");
      setSaveMessage("");
      return;
    }

    try {
      setSaveError("");
      setSaveMessage("");

      await saveAssessment(answers);

      setSaveMessage("Your lifestyle assessment has been saved successfully.");
    } catch (error) {
      setSaveError(
        error.message || "Unable to save your lifestyle assessment.",
      );

      setSaveMessage("");
    }
  };

  return (
    <main className="container page">
      {/* Page Header */}
      <section className="page-header">
        <div>
          <div className="flex items-center gap-3">
            <div className="icon-wrapper">
              <Activity size={24} className="text-blue-600" />
            </div>

            <h1 className="page-title">Lifestyle Score</h1>
          </div>

          <p className="mt-3 text-slate-600">
            Assess your daily habits and understand how they contribute to your
            overall lifestyle health.
          </p>
        </div>
      </section>

      {/* Assessment Introduction */}
      <section className="section">
        <Header />
      </section>

      {/* Current Score */}
      <section className="section">
        <StickyScoreBar
          totalScore={totalScore}
          grade={grade}
          answeredCount={answeredCount}
          totalQuestions={QUESTIONS.length}
        />
      </section>

      {/* Questionnaire */}
      <section className="section">
        <Questionnaire
          categories={categories}
          questions={QUESTIONS}
          answers={answers}
          categoryResults={categoryResults}
          showScoring={showScoring}
          onAnswerChange={handleAnswerChange}
        />
      </section>

      {/* Assessment Result */}
      <section className="section">
        <AssessmentResult
          totalScore={totalScore}
          grade={grade}
          feedback={feedback}
          categoryResults={categoryResults}
        />
      </section>

      {/* Grade Reference */}
      <section className="section">
        <GradeReference />
      </section>

      {/* Assessment Controls */}
      <section className="card">
        <div className="card-header">
          <h2 className="card-title">Assessment Controls</h2>

          <p className="text-sm text-slate-500 mt-1">
            Review your score details, save your assessment, or start again.
          </p>
        </div>

        <div className="card-content">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showScoring}
              onChange={(event) => setShowScoring(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />

            <span className="text-sm font-medium text-slate-700">
              Show scoring details
            </span>
          </label>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            {user && (
              <button
                type="button"
                className="btn-primary"
                onClick={handleSaveAssessment}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Assessment"}
              </button>
            )}

            <button
              type="button"
              className="btn-secondary"
              onClick={resetAssessment}
            >
              Reset Assessment
            </button>
          </div>

          {!user && (
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm text-slate-600">
                You can complete the assessment without logging in. Log in to
                save your result.
              </p>
            </div>
          )}

          {saveMessage && (
            <div
              className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3"
              role="status"
            >
              <p className="text-sm text-green-700">{saveMessage}</p>
            </div>
          )}

          {(saveError || lifestyleError) && (
            <div
              className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
              role="alert"
            >
              <p className="text-sm text-red-700">
                {saveError || lifestyleError}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Latest Saved Assessment */}
      {user && latestAssessment && (
        <section className="section">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="card-title">Latest Saved Assessment</h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Your most recently saved lifestyle assessment.
                  </p>
                </div>

                <span className="badge badge-success">
                  Grade {latestAssessment.grade}
                </span>
              </div>
            </div>

            <div className="card-content">
              <div className="flex items-end gap-2">
                <strong className="text-4xl font-bold text-slate-900">
                  {latestAssessment.totalScore}
                </strong>

                <span className="text-sm text-slate-500 mb-1">/ 100</span>
              </div>

              {latestAssessment.assessedAt && (
                <p className="text-sm text-slate-500 mt-3">
                  Saved on{" "}
                  {new Date(latestAssessment.assessedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Assessment History */}
      {user && assessments.length > 0 && (
        <section className="section">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Assessment History</h2>

              <p className="text-sm text-slate-500 mt-1">
                Your saved Lifestyle Score assessments.
              </p>
            </div>

            <div className="card-content">
              <div className="divide-y divide-slate-200">
                {assessments.map((assessment) => (
                  <div
                    key={assessment._id}
                    className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-baseline gap-1">
                        <strong className="text-xl font-bold text-slate-900">
                          {assessment.totalScore}
                        </strong>

                        <span className="text-sm text-slate-500">/ 100</span>
                      </div>

                      <span className="badge badge-success">
                        Grade {assessment.grade}
                      </span>
                    </div>

                    <span className="text-sm text-slate-500">
                      {assessment.assessedAt
                        ? new Date(assessment.assessedAt).toLocaleDateString()
                        : "Unknown date"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
