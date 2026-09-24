// client/src/hooks/useSettingsForm.js

// Manages settings form state, profile data, location fields, contacts, and submission.

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

export default function useSettingsForm() {
  // Get profile data and context actions.
  const { profile, userInfo, fetchProfile, setProfile, setUserInfo, loading } =
    useProfile();

  // Store local settings form state.
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  // Keep a reference to the hidden profile photo input.
  const fileInputRef = useRef(null);

  // Synchronize the form with profile and user data.
  useEffect(() => {
    if (!profile && !userInfo) return;

    const nextForm = createFormFromProfile(profile, userInfo);

    const timer = setTimeout(() => {
      setForm(nextForm);
    }, 0);

    return () => clearTimeout(timer);
  }, [profile, userInfo]);

  // Find the selected district and its available upazilas.
  const selectedDistrict = districtsData.find(
    (district) => district.name === form.location.district,
  );

  const availableUpazilas = selectedDistrict?.upazilas || [];

  // Manage profile photo upload and removal.
  const { handlePhotoSelect, handleRemovePhoto } = useProfilePhoto({
    userInfo,
    setUserInfo,
    setPhotoLoading,
    fileInputRef,
  });

  // Handle standard form input changes.
  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Update height measurements.
  function handleHeightChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      height: {
        ...prev.height,
        [name]: value,
      },
    }));
  }

  // Update district and upazila location fields.
  function handleLocationChange(field, value) {
    setForm((prev) => {
      if (field === "district") {
        return {
          ...prev,
          location: {
            ...prev.location,
            district: value,
            upazila: "",
          },
        };
      }

      return {
        ...prev,
        location: {
          ...prev.location,
          [field]: value,
        },
      };
    });
  }

  // Toggle chronic illness selections.
  function toggleIllness(name) {
    setForm((prev) => {
      const exists = prev.chronicIllnesses.includes(name);

      return {
        ...prev,
        chronicIllnesses: exists
          ? prev.chronicIllnesses.filter((item) => item !== name)
          : [...prev.chronicIllnesses, name],
      };
    });
  }

  // Add a new emergency contact.
  function addEmergencyContact() {
    if (form.emergencyContacts.length >= 3) return;

    setForm((prev) => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, createEmptyContact()],
    }));
  }

  // Remove an emergency contact by index.
  function removeEmergencyContact(index) {
    setForm((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter(
        (_, contactIndex) => contactIndex !== index,
      ),
    }));
  }

  // Update an emergency contact field.
  function handleEmergencyContactChange(index, field, value) {
    setForm((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map((contact, contactIndex) =>
        contactIndex === index
          ? {
              ...contact,
              [field]: value,
            }
          : contact,
      ),
    }));
  }

  // Update the last blood donation date.
  function handleDonationDateChange(field, value) {
    setForm((prev) => ({
      ...prev,
      lastBloodDonation: {
        ...prev.lastBloodDonation,
        [field]: value,
      },
    }));
  }

  // Validate and submit the profile form.
  async function handleSubmit(e) {
    e.preventDefault();

    const validationError = validateSettingsForm(form);

    if (validationError) {
      alert(validationError);
      return;
    }

    setSaving(true);

    const token = localStorage.getItem("token");
    const API_URL = import.meta.env.VITE_API_URL;

    const method = profile ? "PUT" : "POST";
    const payload = buildProfilePayload(form);

    try {
      // Send the profile data to the backend.
      const res = await fetch(`${API_URL}/api/profile`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setProfile(data.profile || data);

        if (data.user) {
          setUserInfo(data.user);
        }

        await fetchProfile();

        alert("Profile saved successfully.");
      } else {
        alert(data.message || "Failed to save profile.");
      }
    } catch (err) {
      console.error(err);

      alert("Something went wrong.");
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
