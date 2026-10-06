// Provides database operations for authenticated user medicines.
// Keeps Mongoose queries separate from HTTP request and validation logic.

import Medicine from "../models/Medicine.js";

// Maximum number of medicines a user can have.
export const MAX_MEDICINES_PER_USER = 10;

// Fetches all medicines belonging to the authenticated user.
export async function findMedicinesByUser(userId) {
  return Medicine.find({
    user: userId,
  }).sort({
    isActive: -1,
    startDate: -1,
  });
}

// Counts all medicines belonging to the authenticated user.
export async function countMedicinesByUser(userId) {
  return Medicine.countDocuments({
    user: userId,
  });
}

// Creates a medicine document for the authenticated user.
export async function createMedicine(medicineData) {
  return Medicine.create(medicineData);
}

// Finds a medicine only when it belongs to the specified user.
export async function findMedicineById(id, userId) {
  return Medicine.findOne({
    _id: id,
    user: userId,
  });
}

// Saves an already loaded and validated medicine document.
export async function saveMedicine(medicine) {
  await medicine.save();

  return medicine;
}

// Deletes a medicine only when it belongs to the specified user.
export async function deleteMedicine(id, userId) {
  return Medicine.findOneAndDelete({
    _id: id,
    user: userId,
  });
}
