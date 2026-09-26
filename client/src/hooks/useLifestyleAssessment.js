// client/src/hooks/useLifestyleAssessment.js

// Manages lifestyle assessment answers, scoring, feedback, and persistence.
// Keeps assessment calculations and interaction logic outside the page component.

import { useMemo, useState } from "react";

import { DEMO_USERS, QUESTIONS } from "../data/lifestyle/lifestyleQuestions";
import { getFeedback, getGrade } from "../utils/lifestyle/lifestyleScoring";

export default function useLifestyleAssessment({ user, saveAssessment }) {
  const [answers, setAnswers] = useState({});
  const [showScoring, setShowScoring] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  // Build the unique assessment category list.
  const categories = useMemo(
    () => [...new Set(QUESTIONS.map((question) => question.category))],
    [],
  );

  // Calculate raw and maximum scores for each category.
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
          if (!Array.isArray(selectedValue)) {
            return;
          }

          selectedValue.forEach((selectedLabel) => {
            const selectedOption = question.options.find(
              (option) => option.label === selectedLabel,
            );

            if (selectedOption) {
              rawScore += selectedOption.points;
            }
          });

          return;
        }

        if (selectedValue) {
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

  // Calculate the overall assessment score.
  const totalScore = useMemo(
    () =>
      Math.round(
        Object.values(categoryResults).reduce(
          (total, result) => total + result.score,
          0,
        ),
      ),
    [categoryResults],
  );

  // Derive the assessment grade from the total score.
  const grade = useMemo(() => getGrade(totalScore), [totalScore]);

  // Derive contextual feedback from the total score.
  const feedback = useMemo(() => getFeedback(totalScore), [totalScore]);

  // Count questions that currently have an answer.
  const answeredCount = useMemo(
    () =>
      QUESTIONS.filter((question) => {
        const value = answers[question.id];

        if (question.type === "multi") {
          return Array.isArray(value) && value.length > 0;
        }

        return Boolean(value);
      }).length,
    [answers],
  );

  // Update an answer and clear previous save feedback.
  const handleAnswerChange = (questionId, value) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [questionId]: value,
    }));

    setSaveMessage("");
    setSaveError("");
  };

  // Load answers from a predefined demo profile.
  const loadDemo = (demoName) => {
    const selectedDemo = DEMO_USERS[demoName];

    if (!selectedDemo) {
      return;
    }

    setAnswers(selectedDemo);
    setSaveMessage("");
    setSaveError("");
  };

  // Reset all assessment answers and messages.
  const resetAssessment = () => {
    setAnswers({});
    setShowScoring(false);
    setSaveMessage("");
    setSaveError("");
  };

  // Validate and persist the current assessment.
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
        error?.message || "Unable to save your lifestyle assessment.",
      );

      setSaveMessage("");
    }
  };

  return {
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
    loadDemo,
    resetAssessment,
    handleSaveAssessment,
  };
}
