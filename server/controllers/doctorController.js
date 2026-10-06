// server/controllers/doctorController.js

// Handles doctor HTTP requests and response formatting.
// Delegates database operations to the doctor service.

import {
  findDoctors,
  countDoctorsByUser,
  createDoctor as createDoctorService,
  updateDoctor as updateDoctorService,
  deleteDoctor as deleteDoctorService,
  MAX_DOCTORS_PER_USER,
} from "../services/doctorService.js";

export async function getDoctors(req, res) {
  try {
    const doctors = await findDoctors(req.userId);
    return res.json(doctors);
  } catch (error) {
    console.error("Failed to fetch doctors:", error);
    return res.status(500).json({ message: "Failed to fetch doctors" });
  }
}

export async function createDoctor(req, res) {
  try {
    const doctorCount = await countDoctorsByUser(req.userId);

    if (doctorCount >= MAX_DOCTORS_PER_USER) {
      return res.status(400).json({
        message: `You can add a maximum of ${MAX_DOCTORS_PER_USER} doctors.`,
      });
    }

    const doctorData = { ...req.body, user: req.userId };
    delete doctorData.user;

    const doctor = await createDoctorService(doctorData, req.userId);

    return res.status(201).json(doctor);
  } catch (error) {
    console.error("Failed to create doctor:", error);
    return res.status(400).json({ message: "Failed to create doctor" });
  }
}

export async function updateDoctor(req, res) {
  try {
    const updateData = { ...req.body };
    delete updateData.user;

    const doctor = await updateDoctorService(
      req.params.id,
      req.userId,
      updateData,
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.json(doctor);
  } catch (error) {
    console.error("Failed to update doctor:", error);
    return res.status(400).json({ message: "Failed to update doctor" });
  }
}

export async function deleteDoctor(req, res) {
  try {
    const doctor = await deleteDoctorService(req.params.id, req.userId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Failed to delete doctor:", error);
    return res.status(400).json({ message: "Failed to delete doctor" });
  }
}
