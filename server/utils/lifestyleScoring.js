// server/utils/lifestyleScoring.js

// Provides lifestyle validation, scoring, grading, and feedback.
// Uses centralized scoring rules and category configuration.

import {
  SCORING_RULES,
  CATEGORY_MAP,
  CATEGORY_LIMITS,
  LIFESTYLE_TOTAL_MAX,
} from "./lifestyleScoringRules.js";

export { LIFESTYLE_TOTAL_MAX };

// Convert the total lifestyle score into its grade.
export function getLifestyleGrade(score) {
  if (score >= 80) return "A+";
  if (score >= 70) return "A";
  if (score >= 60) return "A-";
  if (score >= 50) return "B";

  return "C";
}

// Generate feedback based on the calculated lifestyle score.
export function getLifestyleFeedback(score) {
  if (score >= 90) {
    return "Your lifestyle pattern is very strong overall. Continue maintaining balanced eating, regular physical activity, healthy sleep habits, hydration, and low-risk daily routines while making small improvements where needed.";
  }

  if (score >= 80) {
    return "You have a generally healthy lifestyle with several strong habits. Keep those habits consistent and focus on a few weaker areas such as sleep, activity, diet quality, hydration, or screen time.";
  }

  if (score >= 70) {
    return "Your lifestyle has a good foundation, but there is room for improvement. Focus on consistent physical activity, better food choices, sufficient sleep, hydration, and reducing habits that may negatively affect long-term health.";
  }

  if (score >= 60) {
    return "Your lifestyle includes some healthy habits, but several areas could improve. Start with realistic changes to food choices, activity, sleep, screen time, hydration, and substance use, then build consistency gradually.";
  }

  return "Several lifestyle areas may benefit from meaningful improvement. Start with small sustainable changes, especially around food, physical activity, sleep, hydration, screen use, and substance-related habits, rather than trying to change everything at once.";
}

// Calculate the score for one lifestyle question.
function calculateQuestionScore(questionId, value) {
  const rule = SCORING_RULES[questionId];

  if (!rule) {
    throw new Error(`Unknown lifestyle question: ${questionId}`);
  }

  if (rule.type === "multi") {
    if (!Array.isArray(value)) {
      throw new Error(`${questionId} must contain an array of answers`);
    }

    if (value.length > rule.maxSelections) {
      throw new Error(
        `${questionId} allows a maximum of ${rule.maxSelections} selections`,
      );
    }

    const uniqueValues = [...new Set(value)];

    if (uniqueValues.length !== value.length) {
      throw new Error(`${questionId} contains duplicate answers`);
    }

    return uniqueValues.reduce((total, selectedLabel) => {
      const points = rule.options[selectedLabel];

      if (points === undefined) {
        throw new Error(`Invalid answer for ${questionId}: ${selectedLabel}`);
      }

      return total + points;
    }, 0);
  }

  if (typeof value !== "string" || !value) {
    throw new Error(`${questionId} must contain a valid answer`);
  }

  const points = rule.options[value];

  if (points === undefined) {
    throw new Error(`Invalid answer for ${questionId}: ${value}`);
  }

  return points;
}

// Validate that every configured lifestyle question has an answer.
export function validateLifestyleAnswers(answers) {
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    throw new Error("Lifestyle answers must be an object");
  }

  const questionIds = Object.keys(SCORING_RULES);

  for (const questionId of questionIds) {
    if (!(questionId in answers)) {
      throw new Error(`Missing answer for question: ${questionId}`);
    }

    const value = answers[questionId];

    if (SCORING_RULES[questionId].type === "multi") {
      if (!Array.isArray(value) || value.length === 0) {
        throw new Error(`Missing answer for question: ${questionId}`);
      }
    } else if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(`Missing answer for question: ${questionId}`);
    }
  }

  return true;
}

// Calculate category totals, overall score, grade, and feedback.
export function calculateLifestyleScore(answers) {
  validateLifestyleAnswers(answers);

  const categoryScores = Object.fromEntries(
    Object.keys(CATEGORY_LIMITS).map((category) => [
      category,
      {
        score: 0,
        max: CATEGORY_LIMITS[category],
      },
    ]),
  );

  for (const [questionId, value] of Object.entries(answers)) {
    const category = CATEGORY_MAP[questionId];

    if (!category) {
      throw new Error(`Unknown lifestyle question: ${questionId}`);
    }

    const score = calculateQuestionScore(questionId, value);

    categoryScores[category].score += score;
  }

  const totalScore = Object.values(categoryScores).reduce(
    (total, category) => total + category.score,
    0,
  );

  return {
    categoryScores,
    totalScore: Math.round(totalScore),
    grade: getLifestyleGrade(totalScore),
    feedback: getLifestyleFeedback(totalScore),
  };
}
