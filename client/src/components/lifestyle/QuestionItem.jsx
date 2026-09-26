// client/src/components/lifestyle/QuestionnaireItem.jsx

// Renders an individual lifestyle questionnaire item.
// Handles single and multiple selections and optional score visibility.

// Formats a score value with a positive sign when appropriate.
function formatPoints(points) {
  return points > 0 ? `+${points}` : `${points}`;
}

// Calculates the points contributed by the selected questionnaire options.
function getSelectedPoints(question, selectedValue) {
  if (question.type === "multi") {
    if (!Array.isArray(selectedValue) || selectedValue.length === 0) {
      return null;
    }

    const selectedOptions = question.options.filter((option) =>
      selectedValue.includes(option.label),
    );

    const totalPoints = selectedOptions.reduce(
      (sum, option) => sum + option.points,
      0,
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
    (option) => option.label === selectedValue,
  );

  return selectedOption
    ? {
        totalPoints: selectedOption.points,
        count: 1,
      }
    : null;
}

export function QuestionItem({
  question,
  index,
  answers,
  showScoring,
  onAnswerChange,
}) {
  const selectedValue = answers[question.id];
  const isMulti = question.type === "multi";
  const maxSelections = question.maxSelections ?? 3;

  const selectedCount = Array.isArray(selectedValue) ? selectedValue.length : 0;

  const selectionLimitReached = isMulti && selectedCount >= maxSelections;

  const selectedPoints = getSelectedPoints(question, selectedValue);

  // Handles adding and removing single or multiple answer selections.
  const handleOptionChange = (optionLabel) => {
    if (isMulti) {
      const currentValues = Array.isArray(selectedValue) ? selectedValue : [];

      const isSelected = currentValues.includes(optionLabel);

      if (isSelected) {
        onAnswerChange(
          question.id,
          currentValues.filter((value) => value !== optionLabel),
        );
        return;
      }

      if (currentValues.length >= maxSelections) {
        return;
      }

      onAnswerChange(question.id, [...currentValues, optionLabel]);

      return;
    }

    onAnswerChange(question.id, optionLabel);
  };

  return (
    <div className="py-7 first:pt-0 last:pb-0">
      <div className="flex items-start justify-between gap-5">
        <div>
          <h3 className="font-semibold text-slate-900 leading-6">
            {index + 1}. {question.question}
          </h3>

          {question.subtext && (
            <p className="text-sm text-slate-500 mt-2">{question.subtext}</p>
          )}

          {isMulti && (
            <p className="text-xs text-slate-500 mt-2">
              {selectedCount > 0
                ? `${selectedCount} of ${maxSelections} selected`
                : `Select up to ${maxSelections} options`}
            </p>
          )}
        </div>

        {selectedPoints && (
          <span className="badge badge-success shrink-0">
            {isMulti
              ? `${formatPoints(selectedPoints.totalPoints)} selected`
              : `${formatPoints(selectedPoints.totalPoints)} points`}
          </span>
        )}
      </div>

      {/* Renders the available radio or checkbox answer options. */}
      <div className="grid sm:grid-cols-2 gap-3 mt-5">
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
              className={`
                flex items-center justify-between gap-4
                rounded-xl border px-4 py-3
                cursor-pointer transition-all
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }
                ${
                  isMulti && !isSelected && selectionLimitReached
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }
              `}
            >
              <span className="flex items-center gap-3 min-w-0">
                <input
                  id={inputId}
                  type={isMulti ? "checkbox" : "radio"}
                  name={isMulti ? question.id : `question-${question.id}`}
                  value={option.label}
                  checked={isSelected}
                  disabled={isMulti && !isSelected && selectionLimitReached}
                  onChange={() => handleOptionChange(option.label)}
                  className="h-4 w-4 shrink-0 border-slate-300 text-blue-600 focus:ring-blue-500"
                />

                <span className="text-sm text-slate-700">{option.label}</span>
              </span>

              {showScoring && (
                <span
                  className={`
                    text-sm font-semibold shrink-0
                    ${option.points < 0 ? "text-red-600" : "text-blue-600"}
                  `}
                >
                  {formatPoints(option.points)}
                </span>
              )}
            </label>
          );
        })}
      </div>

      {/* Explains how selected answers affect scoring when enabled. */}
      {showScoring && (
        <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
          <p className="text-xs leading-5 text-slate-500">
            {isMulti
              ? "Selected options are combined and contribute to this category score."
              : "The selected option contributes the displayed points to the category score."}
          </p>
        </div>
      )}
    </div>
  );
}
