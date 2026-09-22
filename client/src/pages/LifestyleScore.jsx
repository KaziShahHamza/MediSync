// client/src/pages/LifestyleScore.jsx

// Main application page for completing the MediSync Lifestyle Assessment.
// Integrates score counters, interactive questionnaire, results display, and history tracking.

import { Activity } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useLifestyle } from "../context/LifestyleContext";

import useLifestyleAssessment from "../hooks/useLifestyleAssessment";

import LifestyleHeader from "../components/lifestyle/LifestyleHeader";
import { StickyScoreBar } from "../components/lifestyle/ScoreHeader";
import { Questionnaire } from "../components/lifestyle/QuestionnaireSection";
import {
  AssessmentResult,
  GradeReference,
} from "../components/lifestyle/AssessmentResults";
import AssessmentControls from "../components/lifestyle/AssessmentControls";
import AssessmentHistory from "../components/lifestyle/AssessmentHistory";

import { QUESTIONS } from "../data/lifestyle/lifestyleQuestions";

// Main lifestyle score page component
export default function LifestyleScore() {
  const { user } = useAuth();

  const {
    latestAssessment,
    assessments,
    saving,
    error: lifestyleError,
    saveAssessment,
  } = useLifestyle();

  const {
    answers,
    showScoring,
    setShowScoring,

    categories,
    categoryResults,
    totalScore,
    grade,
    feedback,
    answeredCount,

    saveMessage,
    saveError,

    handleAnswerChange,
    resetAssessment,
    handleSaveAssessment,
  } = useLifestyleAssessment({
    user,
    saveAssessment,
  });

  return (
    <main className="container page">
      <LifestyleHeader />

      {/* Assessment Introduction */}
      <section className="section">
        <div className="card">
          <div className="card-content">
            <p className="small-label">MediSync Lifestyle Assessment</p>

            <h2 className="section-title mt-2">Lifestyle Score</h2>

            <p className="text-sm leading-6 text-slate-600 mt-3 max-w-3xl">
              Complete the questionnaire based on your usual daily habits. Your
              score is a lifestyle indicator and is not a medical diagnosis or
              clinical health assessment.
            </p>
          </div>
        </div>
      </section>

      {/* Score Progress Bar */}
      <section className="section">
        <StickyScoreBar
          totalScore={totalScore}
          grade={grade}
          answeredCount={answeredCount}
          totalQuestions={QUESTIONS.length}
        />
      </section>

      {/* Questions List */}
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

      {/* Analysis Output */}
      <section className="section">
        <AssessmentResult
          totalScore={totalScore}
          grade={grade}
          feedback={feedback}
          categoryResults={categoryResults}
        />
      </section>

      {/* Grading Key */}
      <section className="section">
        <GradeReference />
      </section>

      {/* Form Action Controls */}
      <section className="section">
        <AssessmentControls
          user={user}
          saving={saving}
          showScoring={showScoring}
          saveMessage={saveMessage}
          saveError={saveError}
          lifestyleError={lifestyleError}
          onShowScoringChange={setShowScoring}
          onSave={handleSaveAssessment}
          onReset={resetAssessment}
        />
      </section>

      {/* Historical Record */}
      {user && (
        <section className="section">
          <AssessmentHistory
            latestAssessment={latestAssessment}
            assessments={assessments}
          />
        </section>
      )}
    </main>
  );
}
