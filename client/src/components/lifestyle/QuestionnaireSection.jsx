// client/src/components/lifestyle/QuestionnaireSection.jsx

// Interactive questionnaire component handling demo profile selection,


import { QuestionItem } from "./QuestionItem";

// Renders interactive buttons for pre-filled demo user profiles
export function DemoSelector({ demoUsers, onSelect }) {
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

// Categorized container component rendering grouped questions
export function Questionnaire({
  categories,
  questions,
  answers,
  categoryResults,
  showScoring,
  onAnswerChange,
}) {
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
