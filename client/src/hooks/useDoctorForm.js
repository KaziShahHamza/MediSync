// client/src/hooks/doctor/useDoctorForm.js

// Manages doctor form state, editing, selection, and CRUD actions.
// Keeps doctor form and API logic outside the Doctors page.

import { useState } from "react";

import {
  cleanDoctorForm,
  createFormFromDoctor,
  resetDoctorForm,
} from "../utils/doctor/doctorFunctions";

const API_URL = import.meta.env.VITE_API_URL;

export function useDoctorForm(fetchDoctors, onClose) {
  // Store the current doctor form values.
  const [form, setForm] = useState(resetDoctorForm);

  // Track the doctor currently being edited.
  const [editingId, setEditingId] = useState(null);

  // Track the doctor currently opened in the details modal.
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Update a standard form field.
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  // Load an existing doctor into the edit form.
  function editDoctor(doctor) {
    if (!doctor) {
      return;
    }

    setEditingId(doctor._id);
    setForm(createFormFromDoctor(doctor));
  }

  // Clear the form and exit edit mode.
  function resetForm() {
    setForm(resetDoctorForm());
    setEditingId(null);
  }

  // Create or update a doctor through the API.
  async function saveDoctor(event) {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return false;
      }

      const cleanedForm = cleanDoctorForm(form);

      const url = editingId
        ? `${API_URL}/api/doctors/${editingId}`
        : `${API_URL}/api/doctors`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedForm),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to save doctor.");
      }

      resetForm();
      await fetchDoctors();
      onClose?.();

      return true;
    } catch (error) {
      console.error("Failed to save doctor:", error);

      return false;
    }
  }

  // Delete a doctor and refresh the doctor list.
  async function deleteDoctor(id) {
    if (!id) {
      return false;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return false;
      }

      const response = await fetch(`${API_URL}/api/doctors/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete doctor.");
      }

      setSelectedDoctor((currentDoctor) =>
        currentDoctor?._id === id ? null : currentDoctor,
      );

      await fetchDoctors();

      return true;
    } catch (error) {
      console.error("Failed to delete doctor:", error);

      return false;
    }
  }

  return {
    form,
    setForm,
    editingId,
    selectedDoctor,
    setSelectedDoctor,

    handleChange,
    editDoctor,
    resetForm,
    saveDoctor,
    deleteDoctor,
  };
}
