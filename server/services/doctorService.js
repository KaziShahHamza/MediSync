// server/services/doctorService.js

// Handles doctor database operations and AI chat synchronization.
// Keeps doctor persistence logic outside HTTP controllers.

import Doctor from "../models/Doctor.js";
import { syncDoctorsToAIChatData } from "./aiChatDataSyncService.js";

export const MAX_DOCTORS_PER_USER = 5;

export async function countDoctorsByUser(userId) {
  return Doctor.countDocuments({ user: userId });
}

export async function findDoctors(userId) {
  return Doctor.find({ user: userId }).sort({ createdAt: -1 });
}

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

export async function updateDoctor(doctorId, userId, updateData) {
  const doctor = await Doctor.findOneAndUpdate(
    { _id: doctorId, user: userId },
    updateData,
    { new: true, runValidators: true },
  );

  if (!doctor) return null;

  try {
    await syncDoctorsToAIChatData(userId);
  } catch (error) {
    console.error("Failed to sync doctors to AI chat data:", error);
  }

  return doctor;
}

export async function deleteDoctor(doctorId, userId) {
  const doctor = await Doctor.findOneAndDelete({
    _id: doctorId,
    user: userId,
  });

  if (!doctor) return null;

  try {
    await syncDoctorsToAIChatData(userId);
  } catch (error) {
    console.error("Failed to sync doctors to AI chat data:", error);
  }

  return doctor;
}
