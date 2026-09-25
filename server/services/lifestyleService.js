// server/services/lifestyleService.js

// Handles lifestyle assessment persistence and business operations.
// Calculates scores, syncs AI data, and maintains assessment history.

import LifestyleAssessment from "../models/LifestyleAssessment.js";

import { calculateLifestyleScore } from "../utils/lifestyleScoring.js";

import { syncLifestyleToAIChatData } from "./aiChatDataService.js";

const MAX_ASSESSMENTS = 10;

// Creates a lifestyle assessment using the provided answers.
export async function createAssessment(userId, answers) {
  const result = calculateLifestyleScore(answers);

  const assessment = await LifestyleAssessment.create({
    user: userId,
    answers,
    categoryScores: result.categoryScores,
    totalScore: result.totalScore,
    grade: result.grade,
    feedback: result.feedback,
    assessedAt: new Date(),
  });

  // Sync the latest lifestyle data with AI chat data.
  try {
    await syncLifestyleToAIChatData(userId);
  } catch (error) {
    console.error("Failed to sync lifestyle to AI chat data:", error);
  }

  // Fetch assessments so only the newest records are retained.
  const assessmentsToKeep = await LifestyleAssessment.find({
    user: userId,
  })
    .sort({ assessedAt: -1 })
    .select("_id")
    .lean();

  if (assessmentsToKeep.length > MAX_ASSESSMENTS) {
    const idsToDelete = assessmentsToKeep
      .slice(MAX_ASSESSMENTS)
      .map((item) => item._id);

    await LifestyleAssessment.deleteMany({
      _id: { $in: idsToDelete },
      user: userId,
    });
  }

  return assessment;
}

// Retrieves the newest lifestyle assessments for the user.
export async function getAssessments(userId) {
  return LifestyleAssessment.find({
    user: userId,
  })
    .sort({ assessedAt: -1 })
    .limit(MAX_ASSESSMENTS)
    .lean();
}

// Retrieves the latest lifestyle assessment for the user.
export async function getLatestAssessment(userId) {
  return LifestyleAssessment.findOne({
    user: userId,
  })
    .sort({ assessedAt: -1 })
    .lean();
}
