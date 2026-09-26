// server/services/aiChatDataSyncService.js

// Synchronizes lifestyle, health, doctor, and complete AIChatData projections.
// Delegates health record loading and health-data construction to aiChatDataService.

import Profile from "../models/Profile.js";
import LifestyleAssessment from "../models/LifestyleAssessment.js";
import Doctor from "../models/Doctor.js";
import AIChatData from "../models/AIChatData.js";

import { getLatestHealthLogs, buildHealthData } from "./aiChatDataService.js";

import {
  mapProfileData,
  mapLifestyleData,
  mapDoctorData,
} from "../utils/aiChatDataHelpers.js";

// Stores the latest lifestyle assessment projection for AI chat.
export async function syncLifestyleToAIChatData(userId) {
  const latestAssessment = await LifestyleAssessment.findOne({
    user: userId,
  })
    .sort({
      assessedAt: -1,
    })
    .lean();

  const lifestyleData = mapLifestyleData(latestAssessment);

  // Update the existing projection or create it when missing.
  return AIChatData.findOneAndUpdate(
    {
      user: userId,
    },
    {
      $set: {
        lifestyle: lifestyleData,
        contextVersion: 1,
      },
      $setOnInsert: {
        user: userId,
      },
    },
    {
      upsert: true,
      new: true,
    },
  );
}

// Rebuilds current health metrics from the latest HealthLog records.
export async function syncHealthToAIChatData(userId) {
  const profilePromise = Profile.findOne({
    user: userId,
  }).lean();

  const healthPromise = getLatestHealthLogs(userId);

  const [profile, health] = await Promise.all([profilePromise, healthPromise]);

  const [bloodPressure, fasting, postMeal, random, weight] = health;

  const healthData = buildHealthData({
    profile,
    bloodPressure,
    fasting,
    postMeal,
    random,
    weight,
  });

  return AIChatData.findOneAndUpdate(
    {
      user: userId,
    },
    {
      $set: {
        health: healthData,
        contextVersion: 1,
      },
      $setOnInsert: {
        user: userId,
      },
    },
    {
      upsert: true,
      new: true,
    },
  );
}

// Rebuilds the complete doctor projection from stored doctor records.
export async function syncDoctorsToAIChatData(userId) {
  const doctors = await Doctor.find({
    user: userId,
  }).lean();

  const doctorData = mapDoctorData(doctors);

  // Update the existing projection or create it when missing.
  return AIChatData.findOneAndUpdate(
    {
      user: userId,
    },
    {
      $set: {
        doctors: doctorData,
        contextVersion: 1,
      },
      $setOnInsert: {
        user: userId,
      },
    },
    {
      upsert: true,
      new: true,
    },
  );
}

// Rebuilds every AIChatData section from the current source collections.
export async function syncAllAIChatData(userId) {
  const [profile, latestAssessment, health, doctors] = await Promise.all([
    Profile.findOne({
      user: userId,
    }).lean(),

    LifestyleAssessment.findOne({
      user: userId,
    })
      .sort({
        assessedAt: -1,
      })
      .lean(),

    getLatestHealthLogs(userId),

    Doctor.find({
      user: userId,
    }).lean(),
  ]);

  const [bloodPressure, fasting, postMeal, random, weight] = health;

  const profileData = mapProfileData(profile);
  const lifestyleData = mapLifestyleData(latestAssessment);

  const healthData = buildHealthData({
    profile,
    bloodPressure,
    fasting,
    postMeal,
    random,
    weight,
  });

  const doctorData = mapDoctorData(doctors);

  // Save the complete synchronized projection in one database operation.
  return AIChatData.findOneAndUpdate(
    {
      user: userId,
    },
    {
      $set: {
        profile: profileData,
        lifestyle: lifestyleData,
        health: healthData,
        doctors: doctorData,
        contextVersion: 1,
      },
      $setOnInsert: {
        user: userId,
      },
    },
    {
      upsert: true,
      new: true,
    },
  );
}
