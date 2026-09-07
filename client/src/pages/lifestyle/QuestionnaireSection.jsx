import React from "react";

export function DemoSelector({ demoUsers, onSelectDemo }) {
  return (
    <section className="card">
      <h2 className="section-title">Demonstration Profiles</h2>
      <p className="section-description">
        Select a sample profile to see how different lifestyle patterns affect
        the score.
      </p>
      <div className="demo-buttons-grid">
        {Object.keys(demoUsers).map((name) => (
          <button
            key={name}
            type="button"
            className="btn-demo"
            onClick={() => onSelectDemo(name)}
          >
            {name}
          </button>
        ))}
      </div>
    </section>
  );
}

export function Questionnaire({
  categories,
  questions,
  answers,
  categoryResults,
  showScoring,
  onAnswerChange,
}) {
  return (
    <form>
      {categories.map((category, categoryIndex) => {
        const categoryQuestions = questions.filter(
          (q) => q.category === category
        );
        const result = categoryResults[category];

        return (
          <section key={category} className="card category-card">
            <div className="category-header">
              <div>
                <div className="category-subtitle">
                  SECTION {categoryIndex + 1}
                </div>
                <h2 className="category-title">{category}</h2>
              </div>
              <div className="text-right">
                <div className="category-score-label">Category score</div>
                <strong className="category-score-val">
                  {result.score} / {result.max}
                </strong>
              </div>
            </div>

            <div className="questions-wrapper">
              {categoryQuestions.map((question, questionIndex) => {
                const selectedValue = answers[question.id];
                const selectedOption = question.options.find(
                  (opt) => opt.label === selectedValue
                );

                return (
                  <div key={question.id} className="question-block">
                    <div className="question-meta">
                      <div>
                        <h3 className="question-heading">
                          {questionIndex + 1}. {question.title}
                        </h3>
                        {question.description && (
                          <p className="question-subtext">
                            {question.description}
                          </p>
                        )}
                      </div>

                      {selectedValue && selectedOption && (
                        <div className="question-selected-points">
                          Selected:{" "}
                          <strong>
                            {selectedOption.points > 0 ? "+" : ""}
                            {selectedOption.points} pts
                          </strong>
                        </div>
                      )}
                    </div>

                    <div className="options-grid">
                      {question.options.map((option) => {
                        const isSelected = selectedValue === option.label;

                        return (
                          <label
                            key={option.label}
                            className={`option-label ${
                              isSelected ? "selected" : ""
                            }`}
                          >
                            <span className="option-text">
                              <input
                                type="radio"
                                name={question.id}
                                value={option.label}
                                checked={isSelected}
                                onChange={() =>
                                  onAnswerChange(question.id, option.label)
                                }
                              />
                              {option.label}
                            </span>

                            <span
                              className={`option-pts ${
                                option.points < 0 ? "negative" : ""
                              }`}
                            >
                              {option.points > 0 ? "+" : ""}
                              {option.points} pts
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    {showScoring && (
                      <div className="scoring-explanation-text">
                        Scores shown above are the raw points assigned to each
                        answer. The final category score is normalized to its
                        maximum category value.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </form>
  );
}