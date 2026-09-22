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

const API_URL = import.meta.env.VITE_API_URL;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function useSettingsForm() {
  const { profile, userInfo, fetchProfile, setProfile, setUserInfo, loading } =
    useProfile();

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!profile && !userInfo) return;

    const nextForm = createFormFromProfile(profile, userInfo);

    const timer = setTimeout(() => {
      setForm(nextForm);
    }, 0);

    return () => clearTimeout(timer);
  }, [profile, userInfo]);

  const selectedDistrict = districtsData.find(
    (district) => district.name === form.location.district,
  );

  const availableUpazilas = selectedDistrict?.upazilas || [];

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

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

  function addEmergencyContact() {
    if (form.emergencyContacts.length >= 3) return;

    setForm((prev) => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, createEmptyContact()],
    }));
  }

  function removeEmergencyContact(index) {
    setForm((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter(
        (_, contactIndex) => contactIndex !== index,
      ),
    }));
  }

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

  function handleDonationDateChange(field, value) {
    setForm((prev) => ({
      ...prev,
      lastBloodDonation: {
        ...prev.lastBloodDonation,
        [field]: value,
      },
    }));
  }

  async function handlePhotoSelect(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

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

  async function handleRemovePhoto() {
    if (!userInfo?.profilePhotoUrl) {
      return;
    }

    const confirmed = window.confirm("Remove your profile photo?");

    if (!confirmed) return;

    setPhotoLoading(true);

    try {
      const token = localStorage.getItem("token");

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

  async function handleSubmit(e) {
    e.preventDefault();

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
