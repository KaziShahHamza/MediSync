// client/src/hooks/settings/useSettingsForm.js

// Manages settings form state, validation, profile submission, and profile photo actions.

import { useEffect, useRef, useState } from "react";

import { useProfile } from "../../context/ProfileContext";
import { districtsData } from "../../data/districtsData";

import useProfilePhoto from "./useProfilePhoto";

import {
  createEmptyContact,
  initialForm,
  createFormFromProfile,
  buildProfilePayload,
} from "../../utils/settings/settingsForm";

import { validateSettingsForm } from "../../utils/settings/settingsHelpers";

const API_URL = import.meta.env.VITE_API_URL;

export default function useSettingsForm() {
  const { profile, userInfo, fetchProfile, setProfile, setUserInfo, loading } =
    useProfile();

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!profile && !userInfo) return;

    setForm(createFormFromProfile(profile, userInfo));
  }, [profile, userInfo]);

  const selectedDistrict = districtsData.find(
    (district) => district.name === form.location.district,
  );

  const availableUpazilas = selectedDistrict?.upazilas || [];

  const { handlePhotoSelect, handleRemovePhoto } = useProfilePhoto({
    userInfo,
    setUserInfo,
    setPhotoLoading,
    fileInputRef,
  });

  function handleChange(event) {
    const { name, value } = event.target;

    const nextValue =
      name === "bloodDonationContactNumber" ? value.replace(/\D/g, "") : value;

    setForm((previous) => ({
      ...previous,
      [name]: nextValue,
    }));
  }
  
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

  function addEmergencyContact() {
    if (form.emergencyContacts.length >= 3) return;

    setForm((previous) => ({
      ...previous,
      emergencyContacts: [...previous.emergencyContacts, createEmptyContact()],
    }));
  }

  function removeEmergencyContact(index) {
    setForm((previous) => ({
      ...previous,
      emergencyContacts: previous.emergencyContacts.filter(
        (_, contactIndex) => contactIndex !== index,
      ),
    }));
  }

  function handleEmergencyContactChange(index, field, value) {
    setForm((previous) => ({
      ...previous,
      emergencyContacts: previous.emergencyContacts.map(
        (contact, contactIndex) =>
          contactIndex === index ? { ...contact, [field]: value } : contact,
      ),
    }));
  }

  function handleDonationDateChange(field, value) {
    setForm((previous) => ({
      ...previous,
      lastBloodDonation: {
        ...previous.lastBloodDonation,
        [field]: value,
      },
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Client-side validation gives the user immediate feedback.
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
        const serverMessage =
          data?.errors?.[0]?.message ||
          data?.message ||
          "Failed to save profile.";

        throw new Error(serverMessage);
      }

      setProfile(data.profile || data);

      if (data.user) {
        setUserInfo(data.user);
      }

      await fetchProfile();

      alert("Profile saved successfully.");
    } catch (err) {
      console.error("Profile save failed:", err);

      alert(err.message || "Something went wrong while saving your profile.");
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
