// client/src/hooks/useProfilePhoto.js

// Handles Cloudinary profile photo upload, backend saving, and photo removal.

const API_URL = import.meta.env.VITE_API_URL;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function useProfilePhoto({
  userInfo,
  setUserInfo,
  setPhotoLoading,
  fileInputRef,
}) {
  // Upload a selected profile photo to Cloudinary and save its URL.
  async function handlePhotoSelect(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate the selected image type.
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // Validate the maximum image size.
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

      // Upload the image directly to Cloudinary.
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

      // Save the uploaded photo metadata to the user account.
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

  // Remove the current profile photo through the backend.
  async function handleRemovePhoto() {
    if (!userInfo?.profilePhotoUrl) {
      return;
    }

    const confirmed = window.confirm("Remove your profile photo?");

    if (!confirmed) return;

    setPhotoLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Request profile photo removal from the server.
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

  return {
    handlePhotoSelect,
    handleRemovePhoto,
  };
}
