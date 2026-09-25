// server/services/medicineService.js

// Handles database operations for user-owned medicines.

import Medicine from "../models/Medicine.js";

// Fetches all medicines belonging to the authenticated user.
export async function findMedicinesByUser(userId) {
  return Medicine.find({
    user: userId,
  }).sort({
    isActive: -1,
    startDate: -1,
  });
}

// Creates a medicine document for the authenticated user.
export async function createMedicine(medicineData) {
  return Medicine.create(medicineData);
}

// Finds a medicine belonging to a specific user.
export async function findMedicineById(id, userId) {
  return Medicine.findOne({
    _id: id,
    user: userId,
  });
}

// Saves an already loaded medicine document.
export async function saveMedicine(medicine) {
  await medicine.save();

  return medicine;
}

// Deletes a medicine owned by the authenticated user.
export async function deleteMedicine(id, userId) {
  return Medicine.findOneAndDelete({
    _id: id,
    user: userId,
  });
}
