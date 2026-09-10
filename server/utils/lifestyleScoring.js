// server/utils/lifestyleScoring.js

const SCORING_RULES = {
  diet: {
    type: "multi",
    maxSelections: 3,
    options: {
      "Mostly homemade meals, rice/roti with vegetables, dal, fish, chicken or eggs. (balanced meals)":
        4,
      "Frequently eat restaurant, burgers, pizza, biryani, kacchi or Calorie-rich foods":
        0,
      "Regular fish, eggs, chicken, dal or protein": 4,
      "Regular vegetables and fruits": 3,
      "Mostly homemade meals. (frequent fried/oily foods)": 1,
      "Mostly homemade meals. (high rice or carbohydrates)": 2,
    },
  },

  eatingTime: {
    type: "multi",
    maxSelections: 3,
    options: {
      "I eat breakfast in the morning (7–10 AM)": 2,
      "I eat lunch at noon (12–3 PM)": 1,
      "I eat dinner in the early night (8–11 PM)": 1,
    },
  },

  addedSugar: {
    type: "single",
    options: {
      "No added sugar": 6,
      "0–2 teaspoons": 4,
      "3–4 teaspoons": 3,
      "5–6 teaspoons": 2,
      "6+ teaspoons": 0,
    },
  },

  junkFood: {
    type: "single",
    options: {
      "Never or Rarely": 3,
      "multiple times/day": 0,
      "1–3 days/week": 2,
      "3-5 days/week": 1,
      "5+ days/week": 0,
    },
  },

  oilyFood: {
    type: "single",
    options: {
      "Never or Rarely": 3,
      "multiple times/day": 0,
      "1–3 days/week": 2,
      "3-5 days/week": 1,
      "5+ days/week": 0,
    },
  },

  sweetDrinks: {
    type: "single",
    options: {
      "Never or Rarely": 3,
      "multiple times/day": 0,
      "1–3 days/week": 2,
      "3-5 days/week": 1,
      "5+ days/week": 0,
    },
  },

  water: {
    type: "single",
    options: {
      "1–2 glasses": 0,
      "3–4 glasses": 3,
      "5–6 glasses": 6,
      "7–8 glasses": 10,
      "9–10 glasses": 9,
      "10+ glasses": 8,
    },
  },

  screenTime: {
    type: "single",
    options: {
      "Less than 2 hours/day": 5,
      "2–5 hours/day": 4,
      "5–7 hours/day": 3,
      "7–10 hours/day": 2,
      "10–12 hours/day": 0,
      "12+ hours/day": 0,
    },
  },

  scrolling: {
    type: "single",
    options: {
      "never or rarely": 5,
      "Less than 60 minutes/day": 3,
      "1–2 hours/day": 2,
      "2–4 hours/day": 1,
      "4–6 hours/day": 0,
      "6+ hours/day": 0,
    },
  },

  sleepDuration: {
    type: "single",
    options: {
      "Less than 5 hours": 0,
      "5–6 hours": 2,
      "6–7 hours": 4,
      "7–9 hours": 5,
      "9+ hours": 3,
    },
  },

  sleepTime: {
    type: "single",
    options: {
      "Early (10 PM–12 AM)": 2,
      "Late (12 AM–2 AM)": 1,
      "Very late (2 AM–4 AM)": 0,
      "Early Morning (4–6 AM)": 0,
    },
  },

  wakeTime: {
    type: "single",
    options: {
      "Early Morning (4–6 AM)": 3,
      "Early (6–8 AM)": 2,
      "Morning (8–10 AM)": 1,
      "Late (10 AM–12 PM)": 0,
      "Noon (12+ PM)": 0,
    },
  },

  walking: {
    type: "single",
    options: {
      "Less than 1 km/day": 1,
      "Around 1 km/day": 2,
      "2–3 km/day": 4,
      "4–5 km/day": 6,
      "More than 5 km/day": 8,
    },
  },

  exercise: {
    type: "single",
    options: {
      Never: 0,
      "1–2 days/week — 10–20 min": 2,
      "3–4 days/week — 10–20 min": 3,
      "1–2 days/week — 30+ min": 4,
      "3–4 days/week — 30+ min": 6,
      "5+ days/week — 30+ min": 8,
      "5+ days/week — 60+ min": 9,
      "30+ min every day": 11,
      "60+ min every day": 12,
    },
  },

  smoking: {
    type: "single",
    options: {
      Never: 5,
      "Former smoker": 4,
      "Rarely / Occasionally": 3,
      "1–2 cigarettes/day": 2,
      "3–5 cigarettes/day": 1,
      "6+ cigarettes/day": 0,
    },
  },

  alcohol: {
    type: "single",
    options: {
      Never: 5,
      "Former drinker": 4,
      "Rarely / Occasionally": 3,
      Daily: 0,
      "1–2 times/week": 2,
      "3–4 times/week": 0,
      "5+ times/week": 0,
    },
  },

  drugs: {
    type: "single",
    options: {
      Never: 5,
      "Former user": 4,
      "Rarely / Occasionally": 3,
      Daily: 0,
      "1–2 times/week": 2,
      "3–4 times/week": 0,
      "5+ times/week": 0,
    },
  },

  marijuana: {
    type: "single",
    options: {
      Never: 5,
      "Former user": 4,
      "Rarely / Occasionally": 3,
      Daily: 0,
      "1–2 times/week": 2,
      "3–4 times/week": 1,
      "5+ times/week": 0,
    },
  },
};

const CATEGORY_MAP = {
  diet: "Food & Sugar",
  eatingTime: "Food & Sugar",
  addedSugar: "Food & Sugar",
  junkFood: "Food & Sugar",
  oilyFood: "Food & Sugar",
  sweetDrinks: "Food & Sugar",

  water: "Hydration",

  screenTime: "Screen Time",
  scrolling: "Screen Time",

  sleepDuration: "Sleep & Schedule",
  sleepTime: "Sleep & Schedule",
  wakeTime: "Sleep & Schedule",

  walking: "Physical Activity",
  exercise: "Physical Activity",

  smoking: "Substances",
  alcohol: "Substances",
  drugs: "Substances",
  marijuana: "Substances",
};

const CATEGORY_LIMITS = {
  "Food & Sugar": 30,
  Hydration: 10,
  "Screen Time": 10,
  "Sleep & Schedule": 10,
  "Physical Activity": 20,
  Substances: 20,
};

export const LIFESTYLE_TOTAL_MAX = 100;

export function getLifestyleGrade(score) {
  if (score >= 80) return "A+";
  if (score >= 70) return "A";
  if (score >= 60) return "A-";
  if (score >= 50) return "B";
  return "C";
}

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
        throw new Error(
          `Invalid answer for ${questionId}: ${selectedLabel}`,
        );
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
    } else if (
      typeof value !== "string" ||
      value.trim().length === 0
    ) {
      throw new Error(`Missing answer for question: ${questionId}`);
    }
  }

  return true;
}

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