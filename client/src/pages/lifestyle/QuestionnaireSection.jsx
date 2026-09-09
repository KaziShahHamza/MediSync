import React from "react";

export function DemoSelector({ demoUsers, onSelect }) {
  return (
    <section className="card">
      <h2 className="section-title">Try a Demo Profile</h2>

      <p className="section-description">
        Select a sample lifestyle profile to see how the assessment works.
      </p>

      <div className="demo-buttons-grid">
        {Object.keys(demoUsers).map((demoName) => (
          <button
            key={demoName}
            type="button"
            className="btn-demo"
            onClick={() => onSelect(demoName)}
          >
            {demoName}
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
  const handleOptionChange = (question, optionLabel) => {
    if (question.type === "multi") {
      const currentValues = Array.isArray(answers[question.id])
        ? answers[question.id]
        : [];

      const alreadySelected = currentValues.includes(optionLabel);

      if (alreadySelected) {
        onAnswerChange(
          question.id,
          currentValues.filter((value) => value !== optionLabel)
        );

        return;
      }

      /*
       * Diet is intended to allow 2–3 selections.
       * Prevent more than 3 selections.
       */
      if (currentValues.length >= 3) {
        return;
      }

      onAnswerChange(question.id, [
        ...currentValues,
        optionLabel,
      ]);

      return;
    }

    onAnswerChange(question.id, optionLabel);
  };

  const getSelectedPoints = (question) => {
    const selectedValue = answers[question.id];

    if (question.type === "multi") {
      if (!Array.isArray(selectedValue) || selectedValue.length === 0) {
        return null;
      }

      const selectedOptions = question.options.filter((option) =>
        selectedValue.includes(option.label)
      );

      const totalPoints = selectedOptions.reduce(
        (sum, option) => sum + option.points,
        0
      );

      return {
        totalPoints,
        count: selectedOptions.length,
      };
    }

    if (!selectedValue) {
      return null;
    }

    const selectedOption = question.options.find(
      (option) => option.label === selectedValue
    );

    return selectedOption
      ? {
          totalPoints: selectedOption.points,
          count: 1,
        }
      : null;
  };

  const formatPoints = (points) => {
    if (points > 0) {
      return `+${points}`;
    }

    return `${points}`;
  };

  return (
    <div>
      {categories.map((category) => {
        const categoryQuestions = questions.filter(
          (question) => question.category === category
        );

        const result = categoryResults[category];

        return (
          <section key={category} className="card category-card">
            <div className="category-header">
              <div>
                <div className="category-subtitle">
                  Lifestyle Category
                </div>

                <h2 className="category-title">{category}</h2>
              </div>

              {result && (
                <div className="text-right">
                  <div className="category-score-label">
                    Category Score
                  </div>

                  <strong className="category-score-val">
                    {result.score} / {result.max}
                  </strong>
                </div>
              )}
            </div>

            <div className="questions-wrapper">
              {categoryQuestions.map((question, index) => {
                const selectedValue = answers[question.id];

                const selectedPoints = getSelectedPoints(question);

                const isMulti = question.type === "multi";

                return (
                  <div
                    key={question.id}
                    className="question-block"
                  >
                    <div className="question-meta">
                      <div>
                        <h3 className="question-heading">
                          {index + 1}. {question.question}
                        </h3>

                        {question.subtext && (
                          <p className="question-subtext">
                            {question.subtext}
                          </p>
                        )}

                        {isMulti && (
                          <p className="question-subtext">
                            {Array.isArray(selectedValue)
                              ? `${selectedValue.length} of 3 selected`
                              : "Select up to 3 options"}
                          </p>
                        )}
                      </div>

                      {selectedPoints && (
                        <div className="question-selected-points">
                          {isMulti
                            ? `${formatPoints(
                                selectedPoints.totalPoints
                              )} selected`
                            : `${formatPoints(
                                selectedPoints.totalPoints
                              )} points`}
                        </div>
                      )}
                    </div>

                    <div className="options-grid">
                      {question.options.map((option) => {
                        const isSelected = isMulti
                          ? Array.isArray(selectedValue) &&
                            selectedValue.includes(option.label)
                          : selectedValue === option.label;

                        const inputId = `${question.id}-${index}-${option.label}`;

                        return (
                          <label
                            key={option.label}
                            htmlFor={inputId}
                            className={`option-label ${
                              isSelected ? "selected" : ""
                            }`}
                          >
                            <span className="option-text">
                              <input
                                id={inputId}
                                type={
                                  isMulti
                                    ? "checkbox"
                                    : "radio"
                                }
                                name={
                                  isMulti
                                    ? question.id
                                    : `question-${question.id}`
                                }
                                value={option.label}
                                checked={isSelected}
                                disabled={
                                  isMulti &&
                                  !isSelected &&
                                  Array.isArray(selectedValue) &&
                                  selectedValue.length >= 3
                                }
                                onChange={() =>
                                  handleOptionChange(
                                    question,
                                    option.label
                                  )
                                }
                              />

                              <span>{option.label}</span>
                            </span>

                            {showScoring && (
                              <span
                                className={`option-pts ${
                                  option.points < 0
                                    ? "negative"
                                    : ""
                                }`}
                              >
                                {formatPoints(option.points)}
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>

                    {showScoring && (
                      <p className="scoring-explanation-text">
                        {isMulti
                          ? "Diet selections are combined and contribute to the Food & Sugar category score."
                          : "The selected option contributes the displayed points to this category."}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}