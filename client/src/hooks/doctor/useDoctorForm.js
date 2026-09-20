// client/src/hooks/doctor/useDoctorForm.js

// Manages doctor form state, create/update/delete operations, and modal selection.
// Keeps API and form state logic outside the Doctors page component.

import { useState } from "react";

import {
  cleanDoctorForm,
  createFormFromDoctor,
  resetDoctorForm,
} from "../../utils/doctor/doctorFunctions";

const API_URL = import.meta.env.VITE_API_URL;

export function useDoctorForm(
  fetchDoctors,
  onClose,
) {
  // Store the current doctor form values.
  const [form, setForm] =
    useState(resetDoctorForm);

  // Track the doctor currently being edited.
  const [editingId, setEditingId] =
    useState(null);

  // Track the doctor currently opened in the details modal.
  const [selectedDoctor, setSelectedDoctor] =
    useState(null);

  // Handles standard text, select, and textarea fields.
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  // Loads an existing doctor into the edit form.
  function editDoctor(doctor) {
    setEditingId(doctor._id);
    setForm(createFormFromDoctor(doctor));
  }

  // Clears the form and exits edit mode.
  function resetForm() {
    setForm(resetDoctorForm());
    setEditingId(null);
  }

  // Creates or updates a doctor through the API.
  async function saveDoctor(event) {
    event.preventDefault();

    try {
      const token =
        localStorage.getItem("token");

      // Stop the request when authentication is unavailable.
      if (!token) {
        return false;
      }

      const cleanedForm =
        cleanDoctorForm(form);

      // Use the appropriate endpoint for create/update.
      const url = editingId
        ? `${API_URL}/api/doctors/${editingId}`
        : `${API_URL}/api/doctors`;

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedForm),
      });

      if (!response.ok) {
        throw new Error(
          "Failed to save doctor",
        );
      }

      // Reset the form and refresh the doctor list after saving.
      resetForm();
      await fetchDoctors();

      // Close the add/edit modal after a successful save.
      onClose?.();

      return true;
    } catch (error) {
      console.error(
        "Failed to save doctor:",
        error,
      );

      return false;
    }
  }

  // Deletes a doctor and refreshes the doctor list.
  async function deleteDoctor(id) {
    try {
      const token =
        localStorage.getItem("token");

      // Stop the request when authentication is unavailable.
      if (!token) {
        return;
      }

      const response = await fetch(
        `${API_URL}/api/doctors/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete doctor",
        );
      }

      // Close the details modal if the deleted doctor was open.
      setSelectedDoctor(
        (currentDoctor) =>
          currentDoctor?._id === id
            ? null
            : currentDoctor,
      );

      // Refresh the list after successful deletion.
      await fetchDoctors();
    } catch (error) {
      console.error(
        "Failed to delete doctor:",
        error,
      );
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