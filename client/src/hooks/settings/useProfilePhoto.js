// client/src/hooks/useProfilePhoto.js

// Handles profile photo upload, backend persistence, and photo removal.
// Uploads images directly to Cloudinary and stores only photo metadata in the backend.

const API_URL = import.meta.env.VITE_API_URL;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function useProfilePhoto({
  userInfo,
  setUserInfo,
  setPhotoLoading,
  fileInputRef,
}) {
  // Uploads a selected profile image and saves its Cloudinary metadata.
  async function handlePhotoSelect(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validate the selected file before uploading.
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

      // Upload the image directly to Cloudinary.
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(
          uploadData?.error?.message || "Failed to upload profile photo.",
        );
      }

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication is required.");
      }

      // Save the uploaded photo metadata to the user account.
      const saveResponse = await fetch(`${API_URL}/api/profile/photo`, {
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

      const saveData = await saveResponse.json();

      if (!saveResponse.ok) {
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

  // Removes the current profile photo through the backend.
  async function handleRemovePhoto() {
    if (!userInfo?.profilePhotoUrl) return;

    const confirmed = window.confirm("Remove your profile photo?");

    if (!confirmed) return;

    setPhotoLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication is required.");
      }

      // Request profile photo removal from the backend.
      const response = await fetch(`${API_URL}/api/profile/photo`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
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
