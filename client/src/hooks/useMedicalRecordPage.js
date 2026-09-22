// client/src/hooks/useMedicalRecordPage.js

// Manages medical record page state, image zooming, file upload, and document deletion logic.

import { useState } from "react";

// Environment variables for API and Cloudinary uploads
const API_URL = import.meta.env.VITE_API_URL;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Custom hook to manage state and actions for medical records
export default function useMedicalRecordPage({
  records,
  fetchRecords,
  config,
}) {
  // Input and selection state
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const [selected, setSelected] = useState(null);

  // Async process state
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  // Modal zoom level state
  const [zoom, setZoom] = useState(1);

  // Increments image zoom scale
  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  // Decrements image zoom scale
  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  // Resets image zoom to default scale
  const resetZoom = () => {
    setZoom(1);
  };

  // Closes full-view modal and resets image scale
  const closeModal = () => {
    setSelected(null);
    resetZoom();
  };

  // Handles input file selection
  const handleFileChange = (event) => {
    setFile(event.target.files?.[0] || null);
  };

  // Handles uploading file, creating record, and requesting AI analysis
  async function handleUpload() {
    if (!title.trim() || !file) {
      alert(`Select an image and enter a ${config.singular} title.`);
      return;
    }

    setLoading(true);
    setUploadStatus("Uploading image...");

    try {
      // Form payload setup for image service
      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      formData.append("folder", config.folder);

      // Upload image binary to Cloudinary
      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!uploadRes.ok) {
        throw new Error("Failed to upload image.");
      }

      const uploadData = await uploadRes.json();

      const token = localStorage.getItem("token");

      setUploadStatus("Saving medical record...");

      // Persist uploaded record to database
      const recordRes = await fetch(`${API_URL}${config.apiPath}`, {
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

      const record = await recordRes.json();

      if (!recordRes.ok) {
        throw new Error(record.message || `Failed to save ${config.singular}.`);
      }

      setUploadStatus("Analyzing document with AI...");

      // Trigger asynchronous AI analysis for document summary
      try {
        const analyzeRes = await fetch(
          `${API_URL}${config.apiPath}/${record._id}/analyze`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!analyzeRes.ok) {
          const errorData = await analyzeRes.json();

          console.error(
            "AI analysis failed:",
            errorData.message || "Unknown error",
          );
        }
      } catch (analysisError) {
        console.error("AI analysis failed:", analysisError);
      }

      // Reset input state and refresh list
      setTitle("");
      setFile(null);
      setUploadStatus("");

      await fetchRecords();
    } catch (err) {
      console.error(err);

      alert(err.message || `Failed to upload ${config.singular}.`);
    } finally {
      setLoading(false);
      setUploadStatus("");
    }
  }

  // Removes a saved medical record
  async function deleteRecord(id) {
    if (!window.confirm(`Delete ${config.singular}?`)) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      // Send delete request to server
      const res = await fetch(`${API_URL}${config.apiPath}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();

        throw new Error(data.message || `Failed to delete ${config.singular}.`);
      }

      // Close modal if deleted item is currently viewed
      if (selected?._id === id) {
        setSelected(null);
        resetZoom();
      }

      await fetchRecords();
    } catch (err) {
      console.error(`Failed to delete ${config.singular}:`, err);

      alert(err.message || `Failed to delete ${config.singular}.`);
    }
  }

  // Export hook interface
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
