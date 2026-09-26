// client/src/hooks/useMedicalRecordPage.js

// Manages medical record upload, deletion, selection, and image zoom.
// Keeps Cloudinary, API, and modal state logic outside the page component.

import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function useMedicalRecordPage({
  records,
  fetchRecords,
  config,
}) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [selected, setSelected] = useState(null);

  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const [zoom, setZoom] = useState(1);

  // Increase image zoom up to the maximum supported scale.
  const zoomIn = () => {
    setZoom((previousZoom) => Math.min(previousZoom + 0.25, 3));
  };

  // Decrease image zoom down to the minimum supported scale.
  const zoomOut = () => {
    setZoom((previousZoom) => Math.max(previousZoom - 0.25, 0.5));
  };

  // Restore the image to its default zoom level.
  const resetZoom = () => {
    setZoom(1);
  };

  // Close the selected record modal and restore zoom.
  const closeModal = () => {
    setSelected(null);
    resetZoom();
  };

  // Store the selected upload file.
  const handleFileChange = (event) => {
    setFile(event.target.files?.[0] || null);
  };

  // Upload an image, save its record, and trigger AI analysis.
  async function handleUpload() {
    if (!title.trim() || !file) {
      alert(`Select an image and enter a ${config.singular} title.`);
      return;
    }

    setLoading(true);
    setUploadStatus("Uploading image...");

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", config.folder);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const uploadData = await uploadResponse.json().catch(() => ({}));

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error?.message || "Failed to upload image.");
      }

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication is required.");
      }

      setUploadStatus("Saving medical record...");

      const recordResponse = await fetch(`${API_URL}${config.apiPath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          imageUrl: uploadData.secure_url,
        }),
      });

      const record = await recordResponse.json().catch(() => ({}));

      if (!recordResponse.ok) {
        throw new Error(record.message || `Failed to save ${config.singular}.`);
      }

      setUploadStatus("Analyzing document with AI...");

      // AI analysis is best-effort and should not fail the saved record.
      try {
        const analyzeResponse = await fetch(
          `${API_URL}${config.apiPath}/${record._id}/analyze`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!analyzeResponse.ok) {
          const analysisError = await analyzeResponse.json().catch(() => ({}));

          console.error(
            "AI analysis failed:",
            analysisError.message || "Unknown error",
          );
        }
      } catch (analysisError) {
        console.error("AI analysis failed:", analysisError);
      }

      setTitle("");
      setFile(null);

      await fetchRecords();
    } catch (error) {
      console.error(error);

      alert(error?.message || `Failed to upload ${config.singular}.`);
    } finally {
      setLoading(false);
      setUploadStatus("");
    }
  }

  // Delete a medical record and refresh the record collection.
  async function deleteRecord(id) {
    if (!window.confirm(`Delete ${config.singular}?`)) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Authentication is required.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}${config.apiPath}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Failed to delete ${config.singular}.`);
      }

      if (selected?._id === id) {
        setSelected(null);
        resetZoom();
      }

      await fetchRecords();
    } catch (error) {
      console.error(`Failed to delete ${config.singular}:`, error);

      alert(error?.message || `Failed to delete ${config.singular}.`);
    }
  }

  return {
    records,

    title,
    setTitle,

    file,
    setFile,

    selected,
    setSelected,

    loading,
    uploadStatus,

    zoom,
    zoomIn,
    zoomOut,
    resetZoom,

    closeModal,

    handleFileChange,
    handleUpload,
    deleteRecord,
  };
}
