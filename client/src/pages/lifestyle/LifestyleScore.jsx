// src/pages/lifestyle/LifestyleScore.jsx

import { useMemo, useState } from "react";
import "./styles.css";

import { useAuth } from "../../context/AuthContext";
import { useLifestyle } from "../../context/LifestyleContext";

import Header, {
  StickyScoreBar,
} from "./ScoreHeader";

import {
  DemoSelector,
  Questionnaire,
} from "./QuestionnaireSection";

import {
  AssessmentResult,
  GradeReference,
} from "./AssessmentResults";

import { QUESTIONS, DEMO_USERS } from "./lifestyleQuestions";
import {
  getGrade,
  getFeedback,
} from "./lifestyleScoring";

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

      setSaveMessage(
        "Your lifestyle assessment has been saved successfully.",
      );
    } catch (error) {
      setSaveError(
        error.message || "Unable to save your lifestyle assessment.",
      );
      setSaveMessage("");
    }
  };

  return (
    <main className="assessment-container">
      <div className="assessment-wrapper">
        <Header />

        <DemoSelector
          demoUsers={DEMO_USERS}
          onSelect={loadDemo}
        />

        <StickyScoreBar
          totalScore={totalScore}
          grade={grade}
          answeredCount={answeredCount}
          totalQuestions={QUESTIONS.length}
        />

        <Questionnaire
          categories={categories}
          questions={QUESTIONS}
          answers={answers}
          categoryResults={categoryResults}
          showScoring={showScoring}
          onAnswerChange={handleAnswerChange}
        />

        <AssessmentResult
          totalScore={totalScore}
          grade={grade}
          feedback={feedback}
          categoryResults={categoryResults}
        />

        <GradeReference />

        <section className="scoring-controls">
          <label className="scoring-toggle">
            <input
              type="checkbox"
              checked={showScoring}
              onChange={(event) =>
                setShowScoring(event.target.checked)
              }
            />

            <span>
              Show scoring details
            </span>
          </label>

          <div className="assessment-actions">
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
            <p className="assessment-note">
              You can complete the assessment without logging in.
              Log in to save your result.
            </p>
          )}

          {saveMessage && (
            <p className="success-message" role="status">
              {saveMessage}
            </p>
          )}

          {(saveError || lifestyleError) && (
            <p className="error-message" role="alert">
              {saveError || lifestyleError}
            </p>
          )}
        </section>

        {user && latestAssessment && (
          <section className="latest-assessment-card">
            <h2>Latest Saved Assessment</h2>

            <div className="latest-assessment-summary">
              <span>
                Score:{" "}
                <strong>
                  {latestAssessment.totalScore}/100
                </strong>
              </span>

              <span>
                Grade:{" "}
                <strong>
                  {latestAssessment.grade}
                </strong>
              </span>
            </div>

            {latestAssessment.assessedAt && (
              <p>
                Saved on{" "}
                {new Date(
                  latestAssessment.assessedAt,
                ).toLocaleDateString()}
              </p>
            )}
          </section>
        )}

        {user && assessments.length > 0 && (
          <section className="assessment-history-card">
            <h2>Assessment History</h2>

            <div className="assessment-history-list">
              {assessments.map((assessment) => (
                <div
                  key={assessment._id}
                  className="assessment-history-item"
                >
                  <div>
                    <strong>
                      {assessment.totalScore}/100
                    </strong>

                    <span>
                      Grade {assessment.grade}
                    </span>
                  </div>

                  <span>
                    {assessment.assessedAt
                      ? new Date(
                          assessment.assessedAt,
                        ).toLocaleDateString()
                      : "Unknown date"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}