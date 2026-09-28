// client/src/pages/LifestyleScore.jsx

// Renders the MediSync lifestyle assessment page.
// Organizes the questionnaire and assessment information into a responsive two-column layout.

import { useAuth } from "../context/AuthContext";
import { useLifestyle } from "../context/LifestyleContext";

import useLifestyleAssessment from "../hooks/useLifestyleAssessment";

import LifestyleHeader from "../components/lifestyle/LifestyleHeader";
import { StickyScoreBar } from "../components/lifestyle/ScoreHeader";
import { Questionnaire } from "../components/lifestyle/QuestionnaireSection";
import {
  AssessmentResult,
  GradeReference,
} from "../components/lifestyle/assessment/AssessmentResults";
import AssessmentControls from "../components/lifestyle/assessment/AssessmentControls";
import AssessmentHistory from "../components/lifestyle/assessment/AssessmentHistory";

import { QUESTIONS } from "../data/lifestyleQuestions";

// Provides the complete lifestyle assessment workflow.
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

      {/* Responsive assessment workspace with questions and supporting information. */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)] lg:gap-8">
        {/* Main questionnaire column. */}
        <div className="min-w-0">
          <section>
            <div className="mb-6">
              <div className="card">
                <div className="card-content">
                  <p className="small-label">Lifestyle Assessment</p>

                  <h2 className="section-title mt-2">
                    Complete your assessment
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                    Answer the questions based on your usual daily habits.
                    Select the options that best describe your lifestyle.
                  </p>
                </div>
              </div>
            </div>

            {/* Displays the interactive lifestyle questionnaire. */}
            <Questionnaire
              categories={categories}
              questions={QUESTIONS}
              answers={answers}
              categoryResults={categoryResults}
              showScoring={showScoring}
              onAnswerChange={handleAnswerChange}
            />
          </section>
        </div>

        {/* Supporting assessment information column. */}
        <aside className="min-w-0 lg:sticky lg:top-24">
          <div className="space-y-6">
            {/* Displays assessment progress and current score. */}
            <section>
              <StickyScoreBar
                totalScore={totalScore}
                grade={grade}
                answeredCount={answeredCount}
                totalQuestions={QUESTIONS.length}
              />
            </section>

            {/* Displays calculated assessment results and feedback. */}
            <section>
              <AssessmentResult
                totalScore={totalScore}
                grade={grade}
                feedback={feedback}
                categoryResults={categoryResults}
              />
            </section>

            {/* Displays the score grading reference. */}
            <section>
              <GradeReference />
            </section>

            {/* Provides assessment saving and reset controls. */}
            <section>
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

            {/* Displays saved assessment history for authenticated users. */}
            {user && (
              <section>
                <AssessmentHistory
                  latestAssessment={latestAssessment}
                  assessments={assessments}
                />
              </section>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
