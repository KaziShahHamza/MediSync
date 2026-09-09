import React, { useMemo, useState } from "react";
import "./styles.css";
import { Header, StickyScoreBar } from "./ScoreHeader";
import { DemoSelector, Questionnaire } from "./QuestionnaireSection";
import { AssessmentResult, GradeReference } from "./AssessmentResults";

const QUESTIONS = [
  // *============================================================*

  // *FOOD & SUGAR — 30 POINTS*

  // *============================================================*

  {
    category: "Food & Sugar",
    id: "diet",
    type: "multi",
    question: "Which types of food best describe your usual diet?",
    subtext: "Select 2–3 options that describe your usual eating pattern.",
    options: [
      {
        label:
          "Mostly homemade meals, rice/roti with vegetables, dal, fish, chicken or eggs. (balanced meals)",
        points: 4,
      },
      {
        label:
          "Frequently eat restaurant, burgers, pizza, biryani, kacchi or Calorie-rich foods",
        points: 0,
      },
      {
        label: "Regular fish, eggs, chicken, dal or protein",
        points: 4,
      },
      {
        label: "Regular vegetables and fruits",
        points: 3,
      },
      {
        label: "Mostly homemade meals. (frequent fried/oily foods)",
        points: 1,
      },
      {
        label: "Mostly homemade meals. (high rice or carbohydrates)",
        points: 2,
      },
    ],
  },
  {
    category: "Food & Sugar",
    id: "eatingTime",
    type: "multi",
    question: "Which meals do you usually eat at regular times?",
    subtext: "Select all that apply.",
    options: [
      {
        label: "I eat breakfast in the morning (7–10 AM)",
        points: 2,
      },
      {
        label: "I eat lunch at noon (12–3 PM)",
        points: 1,
      },
      {
        label: "I eat dinner in the early night (8–11 PM)",
        points: 1,
      },
    ],
  },
  {
    category: "Food & Sugar",
    id: "addedSugar",
    question:
      "How much added sugar with tea or coffee do you usually consume per day?",
    options: [
      { label: "No added sugar", points: 6 },
      { label: "0–2 teaspoons", points: 4 },
      { label: "3–4 teaspoons", points: 3 },
      { label: "5–6 teaspoons", points: 2 },
      { label: "6+ teaspoons", points: 0 },
    ],
  },
  {
    category: "Food & Sugar",
    id: "junkFood",
    question: "How often do you eat fast food or street food?",
    options: [
      { label: "Never or Rarely", points: 3 },
      { label: "multiple times/day", points: 0 },
      { label: "1–3 days/week", points: 2 },
      { label: "3-5 days/week", points: 1 },
      { label: "5+ days/week", points: 0 },
      // { label: "1–3 days/month", points: 3 },
      // { label: "3–4 times/month", points: 2 },
    ],
  },
  {
    category: "Food & Sugar",
    id: "oilyFood",
    question: "How often do you eat fried or oily foods?",
    options: [
      { label: "Never or Rarely", points: 3 },
      { label: "multiple times/day", points: 0 },
      { label: "1–3 days/week", points: 2 },
      { label: "3-5 days/week", points: 1 },
      { label: "5+ days/week", points: 0 },
      // { label: "1–3 days/month", points: 3 },
    ],
  },
  {
    category: "Food & Sugar",
    id: "sweetDrinks",
    question:
      "How often do you consume soft drinks, sugary drinks or ice cream?",
    options: [
      { label: "Never or Rarely", points: 3 },
      { label: "multiple times/day", points: 0 },
      { label: "1–3 days/week", points: 2 },
      { label: "3-5 days/week", points: 1 },
      { label: "5+ days/week", points: 0 },
      // { label: "1–3 days/month", points: 3 },
    ],
  },

  // *============================================================*

  // *HYDRATION — 10 POINTS*

  // *============================================================*

  {
    category: "Hydration",
    id: "water",
    question: "How many glasses of water do you drink per day?",
    options: [
      { label: "1–2 glasses", points: 0 },
      { label: "3–4 glasses", points: 3 },
      { label: "5–6 glasses", points: 6 },
      { label: "7–8 glasses", points: 10 },
      { label: "9–10 glasses", points: 9 },
      { label: "10+ glasses", points: 8 },
    ],
  },

  // *============================================================*

  // *SCREEN TIME — 10 POINTS*

  // *============================================================*

  {
    category: "Screen Time",
    id: "screenTime",
    question: "How much screen time do you have per day?",
    options: [
      { label: "Less than 2 hours/day", points: 5 },
      { label: "2–5 hours/day", points: 4 },
      { label: "5–7 hours/day", points: 3 },
      { label: "7–10 hours/day", points: 2 },
      { label: "10–12 hours/day", points: 0 },
      { label: "12+ hours/day", points: 0 },
    ],
  },
  {
    category: "Screen Time",
    id: "scrolling",
    question:
      "How much time do you spend scrolling Reels, Shorts, social-media newsfeeds?",
    subtext:
      "For example: Facebook, Instagram, TikTok, YouTube Shorts, or X feeds.",
    options: [
      { label: "never or rarely", points: 5 },
      // { label: "Less than 30 minutes/day", points: 4 },
      { label: "Less than 60 minutes/day", points: 3 },
      { label: "1–2 hours/day", points: 2 },
      { label: "2–4 hours/day", points: 1 },
      { label: "4–6 hours/day", points: 0 },
      { label: "6+ hours/day", points: 0 },
    ],
  },

  // *============================================================*

  // *SLEEP & SCHEDULE — 10 POINTS*

  // *============================================================*

  {
    category: "Sleep & Schedule",
    id: "sleepDuration",
    question: "How many hours do you usually sleep per night?",
    options: [
      { label: "Less than 5 hours", points: 0 },
      { label: "5–6 hours", points: 2 },
      { label: "6–7 hours", points: 4 },
      { label: "7–9 hours", points: 5 },
      { label: "9+ hours", points: 3 },
    ],
  },
  {
    category: "Sleep & Schedule",
    id: "sleepTime",
    question: "What time do you usually go to sleep?",
    options: [
      { label: "Early (10 PM–12 AM)", points: 2 },
      { label: "Late (12 AM–2 AM)", points: 1 },
      { label: "Very late (2 AM–4 AM)", points: 0 },
      { label: "Early Morning (4–6 AM)", points: 0 },
    ],
  },
  {
    category: "Sleep & Schedule",
    id: "wakeTime",
    question: "What time do you usually wake up?",
    options: [
      { label: "Early Morning (4–6 AM)", points: 3 },
      { label: "Early (6–8 AM)", points: 2 },
      { label: "Morning (8–10 AM)", points: 1 },
      { label: "Late (10 AM–12 PM)", points: 0 },
      { label: "Noon (12+ PM)", points: 0 },
    ],
  },
  // ============================================================
  // PHYSICAL ACTIVITY — 20 POINTS
  // ============================================================

  {
    category: "Physical Activity",
    id: "walking",
    question: "How much do you usually walk per day?",
    options: [
      { label: "Less than 1 km/day", points: 1 },
      { label: "Around 1 km/day", points: 2 },
      { label: "2–3 km/day", points: 4 },
      { label: "4–5 km/day", points: 6 },
      { label: "More than 5 km/day", points: 8 },
    ],
  },
  {
    category: "Physical Activity",
    id: "exercise",
    question: "How often do you exercise or go to the gym?",
    options: [
      { label: "Never", points: 0 },
      { label: "1–2 days/week — 10–20 min", points: 2 },
      { label: "3–4 days/week — 10–20 min", points: 3 },
      { label: "1–2 days/week — 30+ min", points: 4 },
      { label: "3–4 days/week — 30+ min", points: 6 },
      { label: "5+ days/week — 30+ min", points: 8 },
      { label: "5+ days/week — 60+ min", points: 9 },
      // { label: "3–5 days/month", points: 1 },
      { label: "30+ min every day", points: 11 },
      { label: "60+ min every day", points: 12 },
    ],
  },
  // *============================================================*

  // *SUBSTANCES — 20 POINTS*

  // *============================================================*

  {
    category: "Substances",
    id: "smoking",
    question: "How often do you smoke cigarettes or tobacco?",
    options: [
      { label: "Never", points: 5 },
      { label: "Former smoker", points: 4 },
      { label: "Rarely / Occasionally", points: 3 },
      { label: "1–2 cigarettes/day", points: 2 },
      { label: "3–5 cigarettes/day", points: 1 },
      { label: "6+ cigarettes/day", points: 0 },
    ],
  },
  {
    category: "Substances",
    id: "alcohol",
    question: "How often do you drink alcohol?",
    options: [
      { label: "Never", points: 5 },
      { label: "Former drinker", points: 4 },
      { label: "Rarely / Occasionally", points: 3 },
      { label: "Daily", points: 0 },
      { label: "1–2 times/week", points: 2 },
      { label: "3–4 times/week", points: 0 },
      { label: "5+ times/week", points: 0 },
    ],
  },
  {
    category: "Substances",
    id: "drugs",
    question: "How often do you use recreational drugs?",
    options: [
      { label: "Never", points: 5 },
      { label: "Former user", points: 4 },
      { label: "Rarely / Occasionally", points: 3 },
      { label: "Daily", points: 0 },
      { label: "1–2 times/week", points: 2 },
      { label: "3–4 times/week", points: 0 },
      { label: "5+ times/week", points: 0 },
    ],
  },
  {
    category: "Substances",
    id: "marijuana",
    question: "How often do you use marijuana/cannabis?",
    options: [
      { label: "Never", points: 5 },
      { label: "Former user", points: 4 },
      { label: "Rarely / Occasionally", points: 3 },
      { label: "Daily", points: 0 },
      { label: "1–2 times/week", points: 2 },
      { label: "3–4 times/week", points: 1 },
      { label: "5+ times/week", points: 0 },
    ],
  },
];

// const CATEGORY_LIMITS = {
//   "Food & Sugar": 30,
//   Hydration: 10,
//   "Screen Time": 10,
//   "Sleep & Schedule": 10,
//   "Physical Activity": 20,
//   Substances: 20,
//   // Scrolling: 5,
//   // "Tea & Coffee": 4,
// };

const DEMO_USERS = {};

function getGrade(score) {
  if (score >= 80) return "A+";
  if (score >= 70) return "A";
  if (score >= 60) return "A-";
  if (score >= 50) return "B";
  return "C";
}

function getFeedback(score) {
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

export default function LifestyleScore() {
  const [answers, setAnswers] = useState({});
  const [showScoring, setShowScoring] = useState(false);

  const categories = useMemo(() => {
    return [...new Set(QUESTIONS.map((question) => question.category))];
  }, []);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: value,
    }));
  };

  const categoryResults = useMemo(() => {
    const results = {};

    categories.forEach((category) => {
      const categoryQuestions = QUESTIONS.filter(
        (question) => question.category === category,
      );

      // const categoryMax = CATEGORY_LIMITS[category] || 0;

      let rawScore = 0;
      let maxRawScore = 0;

      categoryQuestions.forEach((question) => {
        let highestPossible = 0;

        if (question.type === "multi") {
          highestPossible = question.options
            .map((option) => option.points)
            .sort((a, b) => b - a)
            .slice(0, 3)
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

      /*
       * Convert the raw category result into the category's
       * assigned percentage of the total 100-point score.
       *
       * Negative raw values cannot make the total score negative.
       */
      // const normalizedScore =
      //   maxRawScore > 0 ? Math.max(0, Math.min(1, rawScore / maxRawScore)) : 0;

      // results[category] = {
      //   score: Math.round(normalizedScore * categoryMax),
      //   max: categoryMax,
      //   rawScore,
      //   maxRawScore,
      // };

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

  const grade = getGrade(totalScore);

  const answeredCount = useMemo(() => {
    return QUESTIONS.filter((question) => {
      const value = answers[question.id];

      if (question.type === "multi") {
        return Array.isArray(value) && value.length > 0;
      }

      return value !== undefined && value !== null && value !== "";
    }).length;
  }, [answers]);

  const loadDemo = (demoName) => {
    setAnswers({
      ...DEMO_USERS[demoName],
    });
  };

  const resetAssessment = () => {
    setAnswers({});
  };

  return (
    <main className="assessment-container">
      <div className="assessment-wrapper">
        <Header />

        <DemoSelector demoUsers={DEMO_USERS} onSelect={loadDemo} />

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
          onAnswerChange={handleAnswerChange}
        />

        <AssessmentResult
          categoryResults={categoryResults}
          totalScore={totalScore}
          getFeedback={getFeedback}
        />

        <GradeReference />

        <section className="card">
          <div className="controls-bar">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showScoring}
                onChange={(event) => setShowScoring(event.target.checked)}
              />
              Show scoring
            </label>

            <button
              type="button"
              className="btn-reset"
              onClick={resetAssessment}
            >
              Reset Assessment
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
