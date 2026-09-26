// client/src/components/lifestyle/QuestionnaireSection.jsx

// Provides demo profile selection and categorized questionnaire sections.
// Connects questionnaire questions with the reusable QuestionItem component.

import { QuestionItem } from "./QuestionItem";

// Renders buttons for selecting pre-filled demonstration profiles.
export function DemoSelector({ demoUsers, onSelect }) {
  // Safely derives available demo profile names from the supplied data.
  const demoNames = Object.keys(demoUsers || {});

  if (demoNames.length === 0) {
    return null;
  }

  return (
    <section className="card">
      <div className="card-header">
        <h2 className="card-title">Try a Demo Profile</h2>

        <p className="text-sm text-slate-500 mt-1">
          Select a sample lifestyle profile to see how the assessment works.
        </p>
      </div>

      <div className="card-content">
        <div className="flex flex-wrap gap-3">
          {demoNames.map((demoName) => (
            <button
              key={demoName}
              type="button"
              className="btn-secondary"
              onClick={() => onSelect(demoName)}
            >
              {demoName}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// Renders questionnaire cards grouped by their lifestyle category.
export function Questionnaire({
  categories,
  questions,
  answers,
  categoryResults,
  showScoring,
  onAnswerChange,
}) {
  // Filters the question collection for each displayed category.
  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const categoryQuestions = questions.filter(
          (question) => question.category === category,
        );

        const result = categoryResults[category];

        return (
          <section key={category} className="card">
            <div className="card-header">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="small-label">Lifestyle Category</p>

                  <h2 className="section-title mt-1">{category}</h2>
                </div>

                {result && (
                  <div className="text-right shrink-0">
                    <p className="small-label">Category Score</p>

                    <strong className="block text-xl font-bold text-slate-900 mt-1">
                      {result.score}{" "}
                      <span className="text-sm font-medium text-slate-500">
                        / {result.max}
                      </span>
                    </strong>
                  </div>
                )}
              </div>
            </div>

            <div className="card-content">
              <div className="divide-y divide-slate-200">
                {categoryQuestions.map((question, index) => (
                  <QuestionItem
                    key={question.id}
                    question={question}
                    index={index}
                    answers={answers}
                    showScoring={showScoring}
                    onAnswerChange={onAnswerChange}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
