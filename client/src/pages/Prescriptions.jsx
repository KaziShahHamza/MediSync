import { useState } from "react";
import { usePrescriptions } from "../context/PrescriptionContext";
import PrescriptionCard from "../components/PrescriptionCard";

import {
  Upload,
  FileImage,
  X,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function Prescriptions() {
  const { prescriptions, fetchPrescriptions } = usePrescriptions();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [selected, setSelected] = useState(null);

  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const [zoom, setZoom] = useState(1);

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  async function handleUpload() {
    if (!title || !file) {
      alert("Select an image and enter a title.");
      return;
    }

    setLoading(true);
    setUploadStatus("Uploading image...");

    try {
      // 1. Upload image to Cloudinary
      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

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

      // 2. Save prescription in MongoDB
      setUploadStatus("Saving medical record...");

      const prescriptionRes = await fetch(`${API_URL}/api/prescriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          imageUrl: uploadData.secure_url,
        }),
      });

      const prescription = await prescriptionRes.json();

      if (!prescriptionRes.ok) {
        throw new Error(prescription.message || "Failed to save prescription.");
      }

      // 3. Automatically analyze with Gemini
      setUploadStatus("Analyzing document with AI...");

      try {
        const analyzeRes = await fetch(
          `${API_URL}/api/prescriptions/${prescription._id}/analyze`,
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

      // Reset form
      setTitle("");
      setFile(null);
      setUploadStatus("");

      // Refresh prescription list
      await fetchPrescriptions();
    } catch (err) {
      console.error(err);
      alert(err.message || "Upload failed.");
    } finally {
      setLoading(false);
      setUploadStatus("");
    }
  }

  async function deletePrescription(id) {
    if (!window.confirm("Delete prescription?")) return;

    const token = localStorage.getItem("token");

    try {
      await fetch(`${API_URL}/api/prescriptions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (selected?._id === id) {
        setSelected(null);
        resetZoom();
      }

      fetchPrescriptions();
    } catch (err) {
      console.error("Failed to delete prescription:", err);
    }
  }

  const closeModal = () => {
    setSelected(null);
    resetZoom();
  };

  return (
    <div className="container py-10">
      {/* Header */}{" "}
      <div className="mb-10">
        {" "}
        <h1 className="page-title">My Prescriptions & Reports</h1>
        <p className="subtitle mt-2">
          Store and manage your medical prescriptions securely.
        </p>
      </div>
      <div className="grid lg:grid-cols-[1.7fr_0.8fr] gap-8 items-start">
        {/* Gallery */}
        <section>
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="section-title">Medical Records Gallery</h2>

              <p className="text-sm text-slate-500 mt-1">
                {prescriptions.length} record
                {prescriptions.length !== 1 && "s"}
              </p>
            </div>
          </div>

          {prescriptions.length ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {prescriptions.map((item) => (
                <PrescriptionCard
                  key={item._id}
                  prescription={item}
                  onOpen={setSelected}
                  onDelete={deletePrescription}
                />
              ))}
            </div>
          ) : (
            <div className="card flex flex-col items-center justify-center py-16 text-center">
              <FileImage size={48} className="text-slate-400" />

              <h3 className="mt-4 text-lg font-semibold text-slate-800">
                No prescriptions yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Upload your first prescription or medical report to keep your
                records organized.
              </p>
            </div>
          )}
        </section>

        {/* Upload */}
        <aside className="card sticky top-24">
          <div className="flex items-center gap-3 mb-6">
            <div>
              <h2 className="card-title">Upload Prescriptions/Reports</h2>

              <p className="text-sm text-slate-500">Add a new medical record</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Title */}
            <div>
              <label>Prescription/Report Title</label>

              <input
                type="text"
                placeholder="Example: Blood Test Report"
                value={title}
                disabled={loading}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
              />
            </div>

            {/* Image */}
            <div>
              <label>Prescription/Report Image</label>

              <label
                className={`flex items-center gap-3 rounded-xl border border-dashed border-slate-300 px-4 py-4 transition duration-150 ${
                  loading
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:border-blue-500 hover:bg-blue-50"
                }`}
              >
                <ImageIcon size={20} className="text-blue-600" />

                <span className="text-sm text-slate-600 truncate">
                  {file ? file.name : "Choose prescription image"}
                </span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  className="hidden"
                  disabled={loading}
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
            </div>

            {/* AI processing status */}
            {loading && uploadStatus && (
              <div className="flex items-center gap-3 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
                <Sparkles
                  size={18}
                  className="text-blue-600 animate-pulse shrink-0"
                />

                <p className="text-sm text-blue-700">{uploadStatus}</p>
              </div>
            )}

            {/* Upload button */}
            <button
              onClick={handleUpload}
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Upload size={18} />

              {loading
                ? uploadStatus || "Processing..."
                : "Upload Prescription"}
            </button>

            <p className="text-xs text-slate-400 leading-relaxed">
              After upload, MediSync will automatically generate a short AI
              summary of the document.
            </p>
          </div>
        </aside>
      </div>
      
      {/* Preview Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-slate-900/70 flex items-center justify-center z-50 p-5"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl max-w-7xl w-full max-h-[92vh] p-6 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-5 shrink-0">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {selected.title}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {new Date(selected.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-1">
                {/* Zoom Out */}
                <button
                  onClick={zoomOut}
                  disabled={zoom <= 0.5}
                  className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition"
                  title="Zoom out"
                >
                  <ZoomOut size={20} />
                </button>

                {/* Zoom Percentage */}
                <span className="text-sm text-slate-600 min-w-12 text-center">
                  {Math.round(zoom * 100)}%
                </span>

                {/* Zoom In */}
                <button
                  onClick={zoomIn}
                  disabled={zoom >= 3}
                  className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition"
                  title="Zoom in"
                >
                  <ZoomIn size={20} />
                </button>

                {/* Reset */}
                <button
                  onClick={resetZoom}
                  className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition"
                  title="Reset zoom"
                >
                  <RotateCcw size={19} />
                </button>

                {/* Close */}
                <button
                  onClick={closeModal}
                  className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-500 transition"
                  title="Close"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="grid lg:grid-cols-[1fr_320px] gap-6 min-h-0 flex-1">
              {/* Image Preview */}
              <div className="image-preview-scroll flex justify-center items-start bg-slate-100 rounded-xl p-4 min-h-[50vh] lg:h-[70vh] overflow-auto">
                <img
                  src={selected.imageUrl}
                  alt={selected.title}
                  className="rounded-xl object-contain transition-all duration-200"
                  style={{
                    width: `${zoom * 100}%`,
                    maxWidth: "none",
                    transformOrigin: "top center",
                  }}
                />
              </div>

              {/* AI Summary */}
              <aside className="rounded-xl border border-slate-200 bg-slate-50 p-5 overflow-auto">
                <div className="flex items-center gap-2 mb-4">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <Sparkles size={18} className="text-blue-600" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      AI Summary
                    </h3>

                    {/* {selected.aiAnalyzedAt && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        Analyzed{" "}
                        {new Date(selected.aiAnalyzedAt).toLocaleDateString()}
                      </p>
                    )} */}
                  </div>
                </div>

                {selected.aiSummary ? (
                  <p className="text-sm leading-7 text-slate-700 whitespace-pre-line">
                    {selected.aiSummary}
                  </p>
                ) : (
                  <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <AlertCircle
                      size={18}
                      className="text-amber-600 shrink-0 mt-0.5"
                    />

                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        AI summary unavailable
                      </p>

                      <p className="text-xs text-amber-700 mt-1 leading-5">
                        This document was uploaded successfully, but its AI
                        analysis could not be completed.
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-slate-200">
                  <p className="text-xs leading-5 text-slate-400">
                    AI-generated summaries are for informational purposes and
                    may not accurately interpret all medical information. Always
                    consult a qualified healthcare professional.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
