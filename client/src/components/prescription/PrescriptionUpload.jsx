// src/components/prescription/PrescriptionUpload.jsx

import { useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileImage,
  Sparkles,
  Upload,
} from "lucide-react";

function PrescriptionUpload({ onUploaded }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setUploadStatus("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setUploadStatus("Please enter a prescription title.");
      return;
    }

    if (!file) {
      setUploadStatus("Please select a prescription image.");
      return;
    }

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setUploadStatus("Cloudinary upload configuration is missing.");
      return;
    }

    setLoading(true);
    setUploadStatus("");

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      setUploadStatus("Uploading prescription image...");

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const uploadData = await cloudinaryResponse.json();

      if (!cloudinaryResponse.ok || !uploadData.secure_url) {
        throw new Error("Cloudinary upload failed");
      }

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      setUploadStatus("Saving prescription...");

      const prescriptionResponse = await fetch(
        `${API_URL}/api/prescriptions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            imageUrl: uploadData.secure_url,
          }),
        },
      );

      const prescription = await prescriptionResponse.json();

      if (!prescriptionResponse.ok) {
        throw new Error(
          prescription.message || "Failed to save prescription",
        );
      }

      setUploadStatus("Generating AI summary...");

      try {
        const analyzeResponse = await fetch(
          `${API_URL}/api/prescriptions/${prescription._id}/analyze`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!analyzeResponse.ok) {
          console.error(
            "Prescription AI analysis failed:",
            await analyzeResponse.text(),
          );
        }
      } catch (analysisError) {
        console.error("Prescription AI analysis failed:", analysisError);
      }

      setTitle("");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setUploadStatus("Prescription uploaded successfully.");

      await onUploaded?.();
    } catch (err) {
      console.error(err);
      setUploadStatus(
        err.message || "Failed to upload prescription. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isSuccess =
    uploadStatus === "Prescription uploaded successfully.";

  const isError =
    uploadStatus &&
    !isSuccess &&
    !loading;

  return (
    <div className="ms-card ms-prescription-upload-card">
      <div className="ms-prescription-upload-header">
        <div className="ms-prescription-upload-icon">
          <Upload size={21} strokeWidth={1.8} />
        </div>

        <div>

          <h2>Upload prescription</h2>
          <p>
            Add a prescription image and let AI create a quick summary.
          </p>
        </div>
      </div>

      <form
        className="ms-form ms-prescription-upload-form"
        onSubmit={handleSubmit}
      >
        <div className="ms-field">
          <label className="ms-label-5" htmlFor="prescription-title">
            Prescription title
          </label>

          <input
            id="prescription-title"
            className="ms-input"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Dr. Rahman — January 2026"
            disabled={loading}
          />
        </div>

        <div className="ms-field">
          <span className="ms-label-5">Prescription image</span>

          <label className="ms-prescription-file-picker">
            <input
              ref={fileInputRef}
              className="ms-prescription-file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
            />

            <span className="ms-prescription-file-icon">
              <FileImage size={23} strokeWidth={1.7} />
            </span>

            <span className="ms-prescription-file-content">
              <strong>
                {file ? file.name : "Choose prescription image"}
              </strong>

              <small>
                {file
                  ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                  : "JPG, PNG or other image formats"}
              </small>
            </span>
          </label>
        </div>

        <div className="ms-prescription-ai-info">
          <div className="ms-prescription-ai-info-icon">
            <Sparkles size={17} strokeWidth={1.8} />
          </div>

          <div>
            <strong>AI-assisted summary</strong>
            <p>
              After upload, MediSync will analyze the prescription image and
              save the generated summary with your record.
            </p>
          </div>
        </div>

        {uploadStatus && (
          <div
            className={`ms-prescription-status ${
              isSuccess
                ? "ms-prescription-status-success"
                : isError
                  ? "ms-prescription-status-error"
                  : "ms-prescription-status-processing"
            }`}
            role="status"
            aria-live="polite"
          >
            {isSuccess ? (
              <CheckCircle2 size={17} />
            ) : isError ? (
              <AlertCircle size={17} />
            ) : (
              <Sparkles size={17} />
            )}

            <span>{uploadStatus}</span>
          </div>
        )}

        <button
          type="submit"
          className="ms-btn ms-btn-primary ms-prescription-upload-button"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="ms-spinner" />
              Processing...
            </>
          ) : (
            <>
              <Upload size={17} strokeWidth={1.9} />
              Upload prescription
            </>
          )}
        </button>

        <p className="ms-prescription-disclaimer">
          AI summaries are for informational purposes only and should not
          replace advice from a qualified healthcare professional.
        </p>
      </form>
    </div>
  );
}

export default PrescriptionUpload;