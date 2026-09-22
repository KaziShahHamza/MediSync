import { useMemo, useState } from "react";

import { QUESTIONS, DEMO_USERS } from "../data/lifestyle/lifestyleQuestions";
import { getGrade, getFeedback } from "../utils/lifestyle/lifestyleScoring";

export default function useLifestyleAssessment({ user, saveAssessment }) {
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

      setSaveMessage("Your lifestyle assessment has been saved successfully.");
    } catch (error) {
      setSaveError(
        error.message || "Unable to save your lifestyle assessment.",
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
