import { useState } from "react";

import {
  cleanDoctorForm,
  createFormFromDoctor,
  resetDoctorForm,
} from "../../utils/doctor/doctorFunctions";

const API_URL = import.meta.env.VITE_API_URL;

export function useDoctorForm(fetchDoctors, onClose) {
  const [form, setForm] = useState(resetDoctorForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  function editDoctor(doctor) {
    setEditingId(doctor._id);
    setForm(createFormFromDoctor(doctor));
  }

  function resetForm() {
    setForm(resetDoctorForm());
    setEditingId(null);
  }

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

      if (!response.ok) {
        throw new Error("Failed to save doctor");
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

  async function deleteDoctor(id) {
    try {
      const token = localStorage.getItem("token");

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
        throw new Error("Failed to delete doctor");
      }

      setSelectedDoctor((currentDoctor) =>
        currentDoctor?._id === id ? null : currentDoctor,
      );

      await fetchDoctors();
    } catch (error) {
      console.error("Failed to delete doctor:", error);
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