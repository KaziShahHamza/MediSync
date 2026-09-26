// client/src/hooks/useSettingsForm.js

// Manages settings form state, profile synchronization, location fields, contacts, and submission.
// Delegates profile photo operations to the dedicated profile photo hook.

import { useEffect, useRef, useState } from "react";

import { useProfile } from "../../context/ProfileContext";
import { districtsData } from "../../data/districtsData";

import useProfilePhoto from "./useProfilePhoto";

import {
  createEmptyContact,
  initialForm,
  createFormFromProfile,
  buildProfilePayload,
  validateSettingsForm,
} from "../../utils/settings/settingsHelpers";

const API_URL = import.meta.env.VITE_API_URL;

export default function useSettingsForm() {
  // Get profile data and context actions.
  const { profile, userInfo, fetchProfile, setProfile, setUserInfo, loading } =
    useProfile();

  // Store local settings form and submission state.
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  // Keep a reference to the hidden profile photo input.
  const fileInputRef = useRef(null);

  // Synchronize local form state with profile data.
  useEffect(() => {
    if (!profile && !userInfo) return;

    setForm(createFormFromProfile(profile, userInfo));
  }, [profile, userInfo]);

  // Find the selected district and its available upazilas.
  const selectedDistrict = districtsData.find(
    (district) => district.name === form.location.district,
  );

  const availableUpazilas = selectedDistrict?.upazilas || [];

  // Delegate profile photo operations to the dedicated hook.
  const { handlePhotoSelect, handleRemovePhoto } = useProfilePhoto({
    userInfo,
    setUserInfo,
    setPhotoLoading,
    fileInputRef,
  });

  // Handle standard form input changes.
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Update height measurements in the nested form state.
  function handleHeightChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      height: {
        ...previous.height,
        [name]: value,
      },
    }));
  }

  // Update district and upazila location fields.
  function handleLocationChange(field, value) {
    setForm((previous) => {
      if (field === "district") {
        return {
          ...previous,
          location: {
            ...previous.location,
            district: value,
            upazila: "",
          },
        };
      }

      return {
        ...previous,
        location: {
          ...previous.location,
          [field]: value,
        },
      };
    });
  }

  // Toggle chronic illness selections.
  function toggleIllness(name) {
    setForm((previous) => {
      const exists = previous.chronicIllnesses.includes(name);

      return {
        ...previous,
        chronicIllnesses: exists
          ? previous.chronicIllnesses.filter((item) => item !== name)
          : [...previous.chronicIllnesses, name],
      };
    });
  }

  // Add an emergency contact up to the configured maximum.
  function addEmergencyContact() {
    if (form.emergencyContacts.length >= 3) return;

    setForm((previous) => ({
      ...previous,
      emergencyContacts: [...previous.emergencyContacts, createEmptyContact()],
    }));
  }

  // Remove an emergency contact by its array index.
  function removeEmergencyContact(index) {
    setForm((previous) => ({
      ...previous,
      emergencyContacts: previous.emergencyContacts.filter(
        (_, contactIndex) => contactIndex !== index,
      ),
    }));
  }

  // Update a specific emergency contact field.
  function handleEmergencyContactChange(index, field, value) {
    setForm((previous) => ({
      ...previous,
      emergencyContacts: previous.emergencyContacts.map(
        (contact, contactIndex) =>
          contactIndex === index
            ? {
                ...contact,
                [field]: value,
              }
            : contact,
      ),
    }));
  }

  // Update the last blood donation date field.
  function handleDonationDateChange(field, value) {
    setForm((previous) => ({
      ...previous,
      lastBloodDonation: {
        ...previous.lastBloodDonation,
        [field]: value,
      },
    }));
  }

  // Validate and submit the profile form.
  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateSettingsForm(form);

    if (validationError) {
      alert(validationError);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Authentication is required.");
      return;
    }

    setSaving(true);

    const method = profile ? "PUT" : "POST";
    const payload = buildProfilePayload(form);

    try {
      // Send the profile payload to the backend.
      const response = await fetch(`${API_URL}/api/profile`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save profile.");
      }

      // Synchronize context state with the saved profile.
      setProfile(data.profile || data);

      if (data.user) {
        setUserInfo(data.user);
      }

      await fetchProfile();

      alert("Profile saved successfully.");
    } catch (err) {
      console.error("Profile save failed:", err);

      alert(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return {
    profile,
    userInfo,
    loading,

    form,
    saving,
    photoLoading,

    fileInputRef,

    availableUpazilas,

    handleChange,
    handleHeightChange,
    handleLocationChange,
    toggleIllness,

    addEmergencyContact,
    removeEmergencyContact,
    handleEmergencyContactChange,

    handleDonationDateChange,

    handlePhotoSelect,
    handleRemovePhoto,

    handleSubmit,
  };
}
