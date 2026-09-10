import React from "react";
export function DemoSelector({ demoUsers, onSelect }) {
  return (
    <section className="card">
      {" "}
      <div className="card-header">
        {" "}
        <h2 className="card-title">Try a Demo Profile</h2>{" "}
        <p className="text-sm text-slate-500 mt-1">
          {" "}
          Select a sample lifestyle profile to see how the assessment
          works.{" "}
        </p>{" "}
      </div>{" "}
      <div className="card-content">
        {" "}
        <div className="flex flex-wrap gap-3">
          {" "}
          {Object.keys(demoUsers).map((demoName) => (
            <button
              key={demoName}
              type="button"
              className="btn-secondary"
              onClick={() => onSelect(demoName)}
            >
              {" "}
              {demoName}{" "}
            </button>
          ))}{" "}
        </div>{" "}
      </div>{" "}
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
    const currentValue = answers[question.id];
    if (question.type === "multi") {
      const currentValues = Array.isArray(currentValue) ? currentValue : [];
      const isSelected = currentValues.includes(optionLabel);
      if (isSelected) {
        onAnswerChange(
          question.id,
          currentValues.filter((value) => value !== optionLabel),
        );
        return;
      }
      const maxSelections = question.maxSelections ?? Infinity;
      if (currentValues.length >= maxSelections) {
        return;
      }
      onAnswerChange(question.id, [...currentValues, optionLabel]);
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
        selectedValue.includes(option.label),
      );
      const totalPoints = selectedOptions.reduce(
        (sum, option) => sum + option.points,
        0,
      );
      return { totalPoints, count: selectedOptions.length };
    }
    if (!selectedValue) {
      return null;
    }
    const selectedOption = question.options.find(
      (option) => option.label === selectedValue,
    );
    return selectedOption
      ? { totalPoints: selectedOption.points, count: 1 }
      : null;
  };
  const formatPoints = (points) => {
    if (points > 0) {
      return `+${points}`;
    }
    return `${points}`;
  };
  return (
    <div className="space-y-6">
      {" "}
      {categories.map((category) => {
        const categoryQuestions = questions.filter(
          (question) => question.category === category,
        );
        const result = categoryResults[category];
        return (
          <section key={category} className="card">
            {" "}
            {/* Category Header */}{" "}
            <div className="card-header">
              {" "}
              <div className="flex items-start justify-between gap-6">
                {" "}
                <div>
                  {" "}
                  <p className="small-label">Lifestyle Category</p>{" "}
                  <h2 className="section-title mt-1"> {category} </h2>{" "}
                </div>{" "}
                {result && (
                  <div className="text-right shrink-0">
                    {" "}
                    <p className="small-label"> Category Score </p>{" "}
                    <strong className="block text-xl font-bold text-slate-900 mt-1">
                      {" "}
                      {result.score}{" "}
                      <span className="text-sm font-medium text-slate-500">
                        {" "}
                        / {result.max}{" "}
                      </span>{" "}
                    </strong>{" "}
                  </div>
                )}{" "}
              </div>{" "}
            </div>{" "}
            {/* Questions */}{" "}
            <div className="card-content">
              {" "}
              <div className="divide-y divide-slate-200">
                {" "}
                {categoryQuestions.map((question, index) => {
                  const selectedValue = answers[question.id];
                  const selectedPoints = getSelectedPoints(question);
                  const isMulti = question.type === "multi";
                  const maxSelections = question.maxSelections ?? 3;
                  const selectedCount = Array.isArray(selectedValue)
                    ? selectedValue.length
                    : 0;
                  const selectionLimitReached =
                    isMulti && selectedCount >= maxSelections;
                  return (
                    <div
                      key={question.id}
                      className="py-7 first:pt-0 last:pb-0"
                    >
                      {" "}
                      {/* Question heading */}{" "}
                      <div className="flex items-start justify-between gap-5">
                        {" "}
                        <div>
                          {" "}
                          <h3 className="font-semibold text-slate-900 leading-6">
                            {" "}
                            {index + 1}. {question.question}{" "}
                          </h3>{" "}
                          {question.subtext && (
                            <p className="text-sm text-slate-500 mt-2">
                              {" "}
                              {question.subtext}{" "}
                            </p>
                          )}{" "}
                          {isMulti && (
                            <p className="text-xs text-slate-500 mt-2">
                              {" "}
                              {selectedCount > 0
                                ? `${selectedCount} of ${maxSelections} selected`
                                : `Select up to ${maxSelections} options`}{" "}
                            </p>
                          )}{" "}
                        </div>{" "}
                        {selectedPoints && (
                          <span className="badge badge-success shrink-0">
                            {" "}
                            {isMulti
                              ? `${formatPoints(selectedPoints.totalPoints)} selected`
                              : `${formatPoints(selectedPoints.totalPoints)} points`}{" "}
                          </span>
                        )}{" "}
                      </div>{" "}
                      {/* Options */}{" "}
                      <div className="grid sm:grid-cols-2 gap-3 mt-5">
                        {" "}
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
                              className={` flex items-center justify-between gap-4 rounded-xl border px-4 py-3 cursor-pointer transition-all ${isSelected ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"} ${isMulti && !isSelected && selectionLimitReached ? "cursor-not-allowed opacity-50" : ""} `}
                            >
                              {" "}
                              <span className="flex items-center gap-3 min-w-0">
                                {" "}
                                <input
                                  id={inputId}
                                  type={isMulti ? "checkbox" : "radio"}
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
                                    selectionLimitReached
                                  }
                                  onChange={() =>
                                    handleOptionChange(question, option.label)
                                  }
                                  className=" h-4 w-4 shrink-0 border-slate-300 text-blue-600 focus:ring-blue-500 "
                                />{" "}
                                <span className="text-sm text-slate-700">
                                  {" "}
                                  {option.label}{" "}
                                </span>{" "}
                              </span>{" "}
                              {showScoring && (
                                <span
                                  className={` text-sm font-semibold shrink-0 ${option.points < 0 ? "text-red-600" : "text-blue-600"} `}
                                >
                                  {" "}
                                  {formatPoints(option.points)}{" "}
                                </span>
                              )}{" "}
                            </label>
                          );
                        })}{" "}
                      </div>{" "}
                      {/* Scoring explanation */}{" "}
                      {showScoring && (
                        <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                          {" "}
                          <p className="text-xs leading-5 text-slate-500">
                            {" "}
                            {isMulti
                              ? "Selected options are combined and contribute to this category score."
                              : "The selected option contributes the displayed points to the category score."}{" "}
                          </p>{" "}
                        </div>
                      )}{" "}
                    </div>
                  );
                })}{" "}
              </div>{" "}
            </div>{" "}
          </section>
        );
      })}{" "}
    </div>
  );
}
