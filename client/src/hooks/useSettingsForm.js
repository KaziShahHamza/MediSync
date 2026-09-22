// client/src/hooks/useSettingsForm.js

// Custom hook to manage user settings state, location cascading, image uploads, and form submission.

import { useEffect, useRef, useState } from "react";
import { useProfile } from "../context/ProfileContext";
import { districtsData } from "../data/districtsData";

import {
  createEmptyContact,
  initialForm,
  createFormFromProfile,
  buildProfilePayload,
  validateSettingsForm,
} from "../utils/settings/settingsHelpers";

// External API configuration constants
const API_URL = import.meta.env.VITE_API_URL;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Custom hook for settings form state management and logic
export default function useSettingsForm() {
  const { profile, userInfo, fetchProfile, setProfile, setUserInfo, loading } =
    useProfile();

  // Local component states
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  // Hidden file input reference
  const fileInputRef = useRef(null);

  // Synchronize form state with fetched profile and user data
  useEffect(() => {
    if (!profile && !userInfo) return;

    const nextForm = createFormFromProfile(profile, userInfo);

    const timer = setTimeout(() => {
      setForm(nextForm);
    }, 0);

    return () => clearTimeout(timer);
  }, [profile, userInfo]);

  // Derived location values based on chosen district
  const selectedDistrict = districtsData.find(
    (district) => district.name === form.location.district,
  );

  const availableUpazilas = selectedDistrict?.upazilas || [];

  // Universal input change handler
  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Updates height measurements
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

  // Updates district/upazila address hierarchy
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

  // Toggles chronic illness checkbox selection
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

  // Appends a new blank emergency contact entry
  function addEmergencyContact() {
    if (form.emergencyContacts.length >= 3) return;

    setForm((prev) => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, createEmptyContact()],
    }));
  }

  // Removes emergency contact by index
  function removeEmergencyContact(index) {
    setForm((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter(
        (_, contactIndex) => contactIndex !== index,
      ),
    }));
  }

  // Updates individual emergency contact fields
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

  // Updates last blood donation date selection
  function handleDonationDateChange(field, value) {
    setForm((prev) => ({
      ...prev,
      lastBloodDonation: {
        ...prev.lastBloodDonation,
        [field]: value,
      },
    }));
  }

  // Handles Cloudinary image selection and upload pipeline
  async function handlePhotoSelect(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate uploaded file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // Validate image file size constraint
    if (file.size > 5 * 1024 * 1024) {
      alert("Profile photo must be smaller than 5 MB.");
      return;
    }

    setPhotoLoading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", "MediSync/profile-photos");

      // Upload file directly to Cloudinary
      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!uploadRes.ok) {
        throw new Error("Failed to upload profile photo.");
      }

      const uploadData = await uploadRes.json();

      const token = localStorage.getItem("token");

      // Save updated photo metadata to user account
      const saveRes = await fetch(`${API_URL}/api/profile/photo`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profilePhotoUrl: uploadData.secure_url,

          profilePhotoPublicId: uploadData.public_id,
        }),
      });

      const saveData = await saveRes.json();

      if (!saveRes.ok) {
        throw new Error(saveData.message || "Failed to save profile photo.");
      }

      setUserInfo(saveData.user);

      alert("Profile photo updated successfully.");
    } catch (err) {
      console.error("Profile photo upload failed:", err);

      alert(err.message || "Failed to update profile photo.");
    } finally {
      setPhotoLoading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  // Handles profile picture deletion
  async function handleRemovePhoto() {
    if (!userInfo?.profilePhotoUrl) {
      return;
    }

    const confirmed = window.confirm("Remove your profile photo?");

    if (!confirmed) return;

    setPhotoLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Request removal of profile photo from server
      const res = await fetch(`${API_URL}/api/profile/photo`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to remove profile photo.");
      }

      setUserInfo(data.user);

      alert("Profile photo removed.");
    } catch (err) {
      console.error("Profile photo removal failed:", err);

      alert(err.message || "Failed to remove profile photo.");
    } finally {
      setPhotoLoading(false);
    }
  }

  // Validates form input and submits saved profile details
  async function handleSubmit(e) {
    e.preventDefault();

    // Client-side validation check
    const validationError = validateSettingsForm(form);

    if (validationError) {
      alert(validationError);
      return;
    }

    setSaving(true);

    const token = localStorage.getItem("token");

    const method = profile ? "PUT" : "POST";

    const payload = buildProfilePayload(form);

    try {
      // Send profile payload to backend endpoint
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

  // Expose hook state values and handler utilities
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
