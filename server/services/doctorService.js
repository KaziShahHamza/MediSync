// server/services/doctorService.js

// Handles doctor database operations and AI chat synchronization.
// Keeps doctor persistence logic outside HTTP controllers.

import Doctor from "../models/Doctor.js";

import { syncDoctorsToAIChatData } from "./aiChatDataService.js";

// Find all doctors owned by a user.
export async function findDoctors(userId) {
  return Doctor.find({
    user: userId,
  }).sort({
    createdAt: -1,
  });
}

// Create a doctor and synchronize the user's AI chat data.
export async function createDoctor(doctorData, userId) {
  const doctor = await Doctor.create({
    ...doctorData,
    user: userId,
  });

  try {
    await syncDoctorsToAIChatData(userId);
  } catch (error) {
    console.error("Failed to sync doctors to AI chat data:", error);
  }

  return doctor;
}

// Update a doctor owned by the specified user.
export async function updateDoctor(doctorId, userId, updateData) {
  const doctor = await Doctor.findOneAndUpdate(
    {
      _id: doctorId,
      user: userId,
    },
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!doctor) {
    return null;
  }

  try {
    await syncDoctorsToAIChatData(userId);
  } catch (error) {
    console.error("Failed to sync doctors to AI chat data:", error);
  }

  return doctor;
}

// Delete a doctor owned by the specified user.
export async function deleteDoctor(doctorId, userId) {
  const doctor = await Doctor.findOneAndDelete({
    _id: doctorId,
    user: userId,
  });

  if (!doctor) {
    return null;
  }

  try {
    await syncDoctorsToAIChatData(userId);
  } catch (error) {
    console.error("Failed to sync doctors to AI chat data:", error);
  }

  return doctor;
}
