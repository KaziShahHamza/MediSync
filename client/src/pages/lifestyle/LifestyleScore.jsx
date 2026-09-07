import React, { useMemo, useState } from "react";
import "./styles.css";

import { Header, StickyScoreBar } from "./ScoreHeader";
import { DemoSelector, Questionnaire } from "./QuestionnaireSection";
import { AssessmentResult, GradeReference } from "./AssessmentResults";

const QUESTIONS = [
  {
    id: "alcohol",
    category: "Substances",
    title: "Alcohol consumption",
    options: [
      { label: "Never", points: 10 },
      { label: "Former", points: 8 },
      { label: "1–2 times/week", points: 5 },
      { label: "3–4 times/week", points: 2 },
      { label: "Daily", points: -3 },
      { label: "Heavy daily", points: -10 },
    ],
  },
  {
    id: "drugs",
    category: "Substances",
    title: "Drug use",
    options: [
      { label: "Never", points: 10 },
      { label: "Former", points: 7 },
      { label: "1–2 times/week", points: 2 },
      { label: "3–4 times/week", points: -3 },
      { label: "Daily", points: -7 },
      { label: "Heavy daily", points: -10 },
    ],
  },
  {
    id: "marijuana",
    category: "Substances",
    title: "Marijuana use",
    options: [
      { label: "Never", points: 10 },
      { label: "Former", points: 7 },
      { label: "1–2 times/week", points: 2 },
      { label: "3–4 times/week", points: -3 },
      { label: "Daily", points: -7 },
      { label: "Heavy daily", points: -10 },
    ],
  },
  {
    id: "smoking",
    category: "Substances",
    title: "Cigarette smoking",
    options: [
      { label: "Never", points: 10 },
      { label: "Former smoker", points: 7 },
      { label: "1–2 cigarettes/day", points: 4 },
      { label: "3–5 cigarettes/day", points: 1 },
      { label: "6–10 cigarettes/day", points: -3 },
      { label: "10+ cigarettes/day", points: -7 },
    ],
  },
  {
    id: "diet",
    category: "Food & Sugar",
    title: "Usual eating pattern",
    options: [
      {
        label:
          "Mostly homemade, balanced meals — rice/roti with vegetables, dal, fish, chicken or eggs",
        points: 10,
      },
      {
        label: "Mostly homemade meals, but often high in rice or other carbohydrates",
        points: 7,
      },
      {
        label: "Mostly homemade meals with frequent fried or oily foods",
        points: 5,
      },
      {
        label: "Frequently eat restaurant or fast food",
        points: 2,
      },
      {
        label: "Frequently eat biryani, tehari, kacchi or other rich foods",
        points: 2,
      },
      {
        label: "Mostly vegetarian",
        points: 8,
      },
      {
        label: "Strictly vegetarian",
        points: 8,
      },
      {
        label: "Mostly packaged or processed foods",
        points: 0,
      },
      {
        label: "Very irregular eating — often skip meals",
        points: 1,
      },
    ],
  },
  {
    id: "sugar",
    category: "Food & Sugar",
    title: "Added sugar consumed per day",
    description:
      "Include sugar added to tea, coffee, soft drinks, sweets, desserts and other foods or drinks.",
    options: [
      { label: "0–2 teaspoons/day", points: 5 },
      { label: "3–4 teaspoons/day", points: 4 },
      { label: "5–6 teaspoons/day", points: 2 },
      { label: "7–8 teaspoons/day", points: 0 },
      { label: "9+ teaspoons/day", points: -3 },
    ],
  },
  {
    id: "junkFood",
    category: "Food & Sugar",
    title: "Street / junk food consumption",
    description:
      "Examples include fuchka, singara, samosa, burgers, pizza, fried chicken, chips and similar foods.",
    options: [
      { label: "Never", points: 5 },
      { label: "1–2 times/month", points: 4 },
      { label: "3–4 times/month", points: 3 },
      { label: "1–2 times/week", points: 2 },
      { label: "3–4 times/week", points: 0 },
      { label: "1–2 times/day", points: -3 },
      { label: "3–4 times/day", points: -5 },
    ],
  },
  {
    id: "oilyFood",
    category: "Food & Sugar",
    title: "Fried / oily food consumption",
    options: [
      { label: "Rarely", points: 5 },
      { label: "1–2 times/month", points: 4 },
      { label: "3–4 times/month", points: 3 },
      { label: "1–2 times/week", points: 2 },
      { label: "3–4 times/week", points: 0 },
      { label: "Daily", points: -2 },
      { label: "Multiple times/day", points: -4 },
    ],
  },
  {
    id: "tea",
    category: "Tea & Coffee",
    title: "Tea per day — without sugar",
    options: [
      { label: "I don't drink tea", points: 2 },
      { label: "1–2 cups/day", points: 2 },
      { label: "3–4 cups/day", points: 1 },
      { label: "5+ cups/day", points: 0 },
    ],
  },
  {
    id: "coffee",
    category: "Tea & Coffee",
    title: "Coffee per day — without sugar",
    options: [
      { label: "I don't drink coffee", points: 2 },
      { label: "1–2 cups/day", points: 2 },
      { label: "3–4 cups/day", points: 1 },
      { label: "5+ cups/day", points: 0 },
    ],
  },
  {
    id: "walking",
    category: "Physical Activity",
    title: "Walking",
    options: [
      { label: "Less than 1 km/day", points: 1 },
      { label: "1 km/day", points: 3 },
      { label: "2–3 km/day", points: 5 },
      { label: "4–5 km/day", points: 7 },
      { label: "More than 5 km/day", points: 8 },
    ],
  },
  {
    id: "exercise",
    category: "Physical Activity",
    title: "Exercise / gym",
    options: [
      { label: "Never", points: 0 },
      { label: "3–5 days/month", points: 1 },
      { label: "1–2 days/week — 10–20 min", points: 2 },
      { label: "3–4 days/week — 10–20 min", points: 3 },
      { label: "1–2 days/week — 30+ min", points: 4 },
      { label: "3–4 days/week — 30+ min", points: 6 },
      { label: "5+ days/week — 30+ min", points: 8 },
      { label: "5+ days/week — 60+ min", points: 9 },
      { label: "60+ min every day", points: 10 },
    ],
  },
  {
    id: "sleep",
    category: "Sleep",
    title: "Average sleep per night",
    options: [
      { label: "Less than 5 hours", points: 1 },
      { label: "5–6 hours", points: 4 },
      { label: "6–7 hours", points: 6 },
      { label: "7–8 hours", points: 8 },
      { label: "8–9 hours", points: 8 },
      { label: "More than 9 hours", points: 5 },
    ],
  },
  {
    id: "water",
    category: "Hydration",
    title: "Water consumed per day",
    options: [
      { label: "1–2 glasses", points: 1 },
      { label: "3–4 glasses", points: 3 },
      { label: "5–6 glasses", points: 5 },
      { label: "7–8 glasses", points: 8 },
      { label: "9–10 glasses", points: 10 },
      { label: "10+ glasses", points: 9 },
    ],
  },
];

const CATEGORY_LIMITS = {
  Substances: 25,
  "Food & Sugar": 25,
  "Tea & Coffee": 5,
  "Physical Activity": 20,
  Sleep: 15,
  Hydration: 10,
};

const DEMO_USERS = {
  "Excellent lifestyle": {
    alcohol: "Never",
    drugs: "Never",
    marijuana: "Never",
    smoking: "Never",
    diet:
      "Mostly homemade, balanced meals — rice/roti with vegetables, dal, fish, chicken or eggs",
    sugar: "0–2 teaspoons/day",
    junkFood: "1–2 times/month",
    oilyFood: "1–2 times/month",
    tea: "1–2 cups/day",
    coffee: "I don't drink coffee",
    walking: "More than 5 km/day",
    exercise: "5+ days/week — 60+ min",
    sleep: "7–8 hours",
    water: "9–10 glasses",
  },
  "Good lifestyle": {
    alcohol: "1–2 times/week",
    drugs: "Never",
    marijuana: "Never",
    smoking: "Never",
    diet: "Mostly homemade meals, but often high in rice or other carbohydrates",
    sugar: "3–4 teaspoons/day",
    junkFood: "3–4 times/month",
    oilyFood: "1–2 times/week",
    tea: "3–4 cups/day",
    coffee: "1–2 cups/day",
    walking: "2–3 km/day",
    exercise: "3–4 days/week — 30+ min",
    sleep: "7–8 hours",
    water: "7–8 glasses",
  },
  "Average lifestyle": {
    alcohol: "3–4 times/week",
    drugs: "Never",
    marijuana: "Never",
    smoking: "3–5 cigarettes/day",
    diet: "Mostly homemade meals with frequent fried or oily foods",
    sugar: "5–6 teaspoons/day",
    junkFood: "1–2 times/week",
    oilyFood: "3–4 times/week",
    tea: "3–4 cups/day",
    coffee: "1–2 cups/day",
    walking: "1 km/day",
    exercise: "1–2 days/week — 30+ min",
    sleep: "6–7 hours",
    water: "5–6 glasses",
  },
  "Needs improvement": {
    alcohol: "Daily",
    drugs: "Never",
    marijuana: "Never",
    smoking: "6–10 cigarettes/day",
    diet: "Frequently eat restaurant or fast food",
    sugar: "7–8 teaspoons/day",
    junkFood: "3–4 times/week",
    oilyFood: "Daily",
    tea: "5+ cups/day",
    coffee: "3–4 cups/day",
    walking: "Less than 1 km/day",
    exercise: "3–5 days/month",
    sleep: "5–6 hours",
    water: "3–4 glasses",
  },
  "High-risk lifestyle": {
    alcohol: "Heavy daily",
    drugs: "Heavy daily",
    marijuana: "Heavy daily",
    smoking: "10+ cigarettes/day",
    diet: "Mostly packaged or processed foods",
    sugar: "9+ teaspoons/day",
    junkFood: "3–4 times/day",
    oilyFood: "Multiple times/day",
    tea: "5+ cups/day",
    coffee: "5+ cups/day",
    walking: "Less than 1 km/day",
    exercise: "Never",
    sleep: "Less than 5 hours",
    water: "1–2 glasses",
  },
};

function getGrade(score) {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "A-";
  if (score >= 60) return "B";
  return "C";
}

function getFeedback(score) {
  if (score >= 90) {
    return "Excellent lifestyle pattern. Continue your current habits and focus on consistency to maintain this strong overall score.";
  }
  if (score >= 80) {
    return "Very good lifestyle pattern. You have several healthy habits already. A few small improvements could move your score even higher.";
  }
  if (score >= 70) {
    return "Good overall lifestyle with room for improvement. Focus on your lowest-scoring areas and make small, consistent changes.";
  }
  if (score >= 60) {
    return "Your lifestyle has some positive habits, but several areas need attention. Start with one or two practical changes and build gradually.";
  }
  return "Several lifestyle habits may be working against your wellbeing. Focus first on reducing harmful habits and improving sleep, activity, food choices and hydration.";
}

export default function LifestyleScore() {
  const [answers, setAnswers] = useState({});
  const [showScoring, setShowScoring] = useState(true);

  const categoryResults = useMemo(() => {
    const results = {};

    Object.entries(CATEGORY_LIMITS).forEach(([category, max]) => {
      results[category] = { raw: 0, maxRaw: 0, score: 0, max };
    });

    QUESTIONS.forEach((question) => {
      const selected = answers[question.id];
      const highest = Math.max(
        ...question.options.map((option) => option.points)
      );

      results[question.category].maxRaw += highest;

      if (selected) {
        const selectedOption = question.options.find(
          (option) => option.label === selected
        );
        if (selectedOption) {
          results[question.category].raw += selectedOption.points;
        }
      }
    });

    Object.values(results).forEach((result) => {
      if (result.maxRaw <= 0) {
        result.score = 0;
        return;
      }
      result.score = Math.round(
        Math.max(0, Math.min(result.raw / result.maxRaw, 1)) * result.max
      );
    });

    return results;
  }, [answers]);

  const totalScore = useMemo(() => {
    return Object.values(categoryResults).reduce(
      (total, category) => total + category.score,
      0
    );
  }, [categoryResults]);

  const grade = getGrade(totalScore);
  const answeredCount = Object.keys(answers).length;
  const categories = Object.keys(CATEGORY_LIMITS);

  function handleChange(questionId, value) {
    setAnswers((previous) => ({ ...previous, [questionId]: value }));
  }

  function resetForm() {
    setAnswers({});
  }

  function loadDemo(name) {
    setAnswers(DEMO_USERS[name]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="assessment-container">
      <div className="assessment-wrapper">
        <Header />

        <DemoSelector demoUsers={DEMO_USERS} onSelectDemo={loadDemo} />

        <StickyScoreBar
          totalScore={totalScore}
          grade={grade}
          answeredCount={answeredCount}
          totalQuestions={QUESTIONS.length}
        />

        <Questionnaire
          categories={categories}
          questions={QUESTIONS}
          answers={answers}
          categoryResults={categoryResults}
          showScoring={showScoring}
          onAnswerChange={handleChange}
        />

        <AssessmentResult
          categoryResults={categoryResults}
          totalScore={totalScore}
          getFeedback={getFeedback}
        />

        <GradeReference />

        {/* Controls */}
        <div className="controls-bar">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showScoring}
              onChange={(e) => setShowScoring(e.target.checked)}
            />
            Show scoring explanations
          </label>

          <button type="button" className="btn-reset" onClick={resetForm}>
            Reset Assessment
          </button>
        </div>
      </div>
    </div>
  );
}