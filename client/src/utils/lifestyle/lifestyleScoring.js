// client/src/pages/lifestyle/lifestyleScoring.js

export { getGrade, getFeedback };

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
