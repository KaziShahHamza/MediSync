import { useMemo, useState } from "react";

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
      results[category] = {
        raw: 0,
        maxRaw: 0,
        score: 0,
        max,
      };
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
  const allAnswered = answeredCount === QUESTIONS.length;

  function handleChange(questionId, value) {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: value,
    }));
  }

  function resetForm() {
    setAnswers({});
  }

  function loadDemo(name) {
    setAnswers(DEMO_USERS[name]);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const categories = Object.keys(CATEGORY_LIMITS);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6f8",
        color: "#1f2937",
        fontFamily:
          "Arial, Helvetica, sans-serif",
        padding: "40px 20px 60px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <header
          style={{
            background: "#ffffff",
            border: "1px solid #d1d5db",
            padding: "30px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: "700",
              color: "#4b5563",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "10px",
            }}
          >
            MediSync Lifestyle Assessment
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: "600",
              color: "#111827",
            }}
          >
            Lifestyle Score
          </h1>

          <p
            style={{
              margin: "12px 0 0",
              maxWidth: "760px",
              lineHeight: 1.6,
              color: "#4b5563",
              fontSize: "15px",
            }}
          >
            Complete the following questionnaire based on your usual daily
            habits. Your score is a lifestyle indicator and is not a medical
            diagnosis or clinical health assessment.
          </p>
        </header>

        {/* Demo users */}
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #d1d5db",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              margin: "0 0 8px",
              fontSize: "18px",
              fontWeight: "600",
              color: "#111827",
            }}
          >
            Demonstration Profiles
          </h2>

          <p
            style={{
              margin: "0 0 18px",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Select a sample profile to see how different lifestyle patterns
            affect the score.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {Object.keys(DEMO_USERS).map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => loadDemo(name)}
                style={{
                  border: "1px solid #9ca3af",
                  background: "#ffffff",
                  color: "#1f2937",
                  padding: "9px 14px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </section>

        {/* Score summary */}
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #d1d5db",
            padding: "24px",
            marginBottom: "24px",
            position: "sticky",
            top: "10px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Current Lifestyle Score
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "10px",
                  marginTop: "5px",
                }}
              >
                <span
                  style={{
                    fontSize: "42px",
                    fontWeight: "700",
                    color: "#111827",
                  }}
                >
                  {totalScore}
                </span>

                <span
                  style={{
                    fontSize: "18px",
                    color: "#6b7280",
                  }}
                >
                  / 100
                </span>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Grade
              </div>

              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#111827",
                  marginTop: "4px",
                }}
              >
                {grade}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "18px",
              height: "8px",
              background: "#e5e7eb",
            }}
          >
            <div
              style={{
                width: `${totalScore}%`,
                height: "100%",
                background: "#374151",
                transition: "width 200ms ease",
              }}
            />
          </div>

          <div
            style={{
              marginTop: "12px",
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            {answeredCount} of {QUESTIONS.length} questions answered
          </div>
        </section>

        {/* Questionnaire */}
        <form>
          {categories.map((category, categoryIndex) => {
            const categoryQuestions = QUESTIONS.filter(
              (question) => question.category === category
            );

            const result = categoryResults[category];

            return (
              <section
                key={category}
                style={{
                  background: "#ffffff",
                  border: "1px solid #d1d5db",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid #d1d5db",
                    background: "#f9fafb",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "15px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        marginBottom: "4px",
                      }}
                    >
                      SECTION {categoryIndex + 1}
                    </div>

                    <h2
                      style={{
                        margin: 0,
                        fontSize: "20px",
                        fontWeight: "600",
                        color: "#111827",
                      }}
                    >
                      {category}
                    </h2>
                  </div>

                  <div
                    style={{
                      textAlign: "right",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                      }}
                    >
                      Category score
                    </div>

                    <strong
                      style={{
                        fontSize: "18px",
                        color: "#111827",
                      }}
                    >
                      {result.score} / {result.max}
                    </strong>
                  </div>
                </div>

                <div style={{ padding: "8px 24px 24px" }}>
                  {categoryQuestions.map((question, questionIndex) => (
                    <div
                      key={question.id}
                      style={{
                        padding: "22px 0",
                        borderBottom:
                          questionIndex === categoryQuestions.length - 1
                            ? "none"
                            : "1px solid #e5e7eb",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "20px",
                          marginBottom: "12px",
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              margin: 0,
                              fontSize: "16px",
                              fontWeight: "600",
                              color: "#111827",
                            }}
                          >
                            {questionIndex + 1}. {question.title}
                          </h3>

                          {question.description && (
                            <p
                              style={{
                                margin: "7px 0 0",
                                fontSize: "13px",
                                lineHeight: 1.5,
                                color: "#6b7280",
                              }}
                            >
                              {question.description}
                            </p>
                          )}
                        </div>

                        {answers[question.id] && (
                          <div
                            style={{
                              fontSize: "13px",
                              color: "#374151",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Selected:{" "}
                            <strong>
                              {question.options.find(
                                (option) =>
                                  option.label === answers[question.id]
                              )?.points > 0
                                ? "+"
                                : ""}
                              {
                                question.options.find(
                                  (option) =>
                                    option.label === answers[question.id]
                                )?.points
                              }{" "}
                              pts
                            </strong>
                          </div>
                        )}
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "minmax(0, 1fr) minmax(0, 1fr)",
                          gap: "8px",
                        }}
                      >
                        {question.options.map((option) => {
                          const selected =
                            answers[question.id] === option.label;

                          return (
                            <label
                              key={option.label}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "12px",
                                border: selected
                                  ? "1px solid #374151"
                                  : "1px solid #d1d5db",
                                background: selected
                                  ? "#f3f4f6"
                                  : "#ffffff",
                                padding: "11px 13px",
                                cursor: "pointer",
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "9px",
                                  fontSize: "14px",
                                  color: "#374151",
                                }}
                              >
                                <input
                                  type="radio"
                                  name={question.id}
                                  value={option.label}
                                  checked={selected}
                                  onChange={() =>
                                    handleChange(
                                      question.id,
                                      option.label
                                    )
                                  }
                                />

                                {option.label}
                              </span>

                              <span
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "600",
                                  color:
                                    option.points < 0
                                      ? "#991b1b"
                                      : "#374151",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {option.points > 0 ? "+" : ""}
                                {option.points} pts
                              </span>
                            </label>
                          );
                        })}
                      </div>

                      {showScoring && (
                        <div
                          style={{
                            marginTop: "10px",
                            fontSize: "12px",
                            color: "#6b7280",
                          }}
                        >
                          Scores shown above are the raw points assigned to
                          each answer. The final category score is normalized
                          to its maximum category value.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </form>

        {/* Results */}
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #d1d5db",
            padding: "28px",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              margin: "0 0 20px",
              fontSize: "20px",
              fontWeight: "600",
              color: "#111827",
            }}
          >
            Assessment Result
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            {Object.entries(categoryResults).map(([category, result]) => (
              <div
                key={category}
                style={{
                  border: "1px solid #d1d5db",
                  padding: "15px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    marginBottom: "5px",
                  }}
                >
                  {category}
                </div>

                <strong
                  style={{
                    fontSize: "20px",
                    color: "#111827",
                  }}
                >
                  {result.score} / {result.max}
                </strong>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              paddingTop: "20px",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                color: "#6b7280",
                marginBottom: "6px",
              }}
            >
              Feedback
            </div>

            <p
              style={{
                margin: 0,
                maxWidth: "800px",
                lineHeight: 1.6,
                color: "#374151",
                fontSize: "15px",
              }}
            >
              {getFeedback(totalScore)}
            </p>
          </div>
        </section>

        {/* Grade reference */}
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #d1d5db",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              margin: "0 0 16px",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            Score Classification
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "8px",
            }}
          >
            {[
              ["A+", "90–100"],
              ["A", "80–89"],
              ["A-", "70–79"],
              ["B", "60–69"],
              ["C", "0–59"],
            ].map(([letter, range]) => (
              <div
                key={letter}
                style={{
                  border: "1px solid #d1d5db",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <strong
                  style={{
                    display: "block",
                    fontSize: "20px",
                  }}
                >
                  {letter}
                </strong>

                <span
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                  }}
                >
                  {range}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              color: "#4b5563",
            }}
          >
            <input
              type="checkbox"
              checked={showScoring}
              onChange={(event) => setShowScoring(event.target.checked)}
            />

            Show scoring explanations
          </label>

          <button
            type="button"
            onClick={resetForm}
            style={{
              border: "1px solid #374151",
              background: "#ffffff",
              color: "#111827",
              padding: "10px 20px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Reset Assessment
          </button>
        </div>

        {/* Disclaimer */}
        <footer
          style={{
            marginTop: "30px",
            paddingTop: "18px",
            borderTop: "1px solid #d1d5db",
            color: "#6b7280",
            fontSize: "12px",
            lineHeight: 1.6,
          }}
        >
          This Lifestyle Score is an educational wellness indicator based on
          the answers provided. It is not intended to diagnose, treat, or
          predict any medical condition and should not replace professional
          medical advice.
        </footer>
      </div>
    </div>
  );
}