// client/src/pages/Prescriptions.jsx

import { useState } from "react";
import { usePrescriptions } from "../context/PrescriptionContext";
import PrescriptionCard from "../components/PrescriptionCard";
import { Upload, FileImage, X, Image as ImageIcon } from "lucide-react";
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
      alert("Select image and title.");
      return;
    }

    setLoading(true);

    try {
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

      const uploadData = await uploadRes.json();
      const token = localStorage.getItem("token");

      await fetch(`${API_URL}/api/prescriptions`, {
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

      setTitle("");
      setFile(null);
      fetchPrescriptions();
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }

    setLoading(false);
  }

  async function deletePrescription(id) {
    if (!window.confirm("Delete prescription?")) return;

    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/api/prescriptions/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchPrescriptions();
  }

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="page-title">Prescriptions</h1>

        <p className="subtitle mt-2">
          Store and manage your medical prescriptions securely.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.7fr_0.8fr] gap-8 items-start">
        {/* Gallery */}
        <section>
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="section-title">Prescription Gallery</h2>

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
                Upload your first prescription to keep records organized.
              </p>
            </div>
          )}
        </section>

        {/* Upload */}
        <aside className="card sticky top-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Upload size={22} />
            </div>

            <div>
              <h2 className="card-title">Upload Prescription</h2>

              <p className="text-sm text-slate-500">Add a new medical record</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label>Prescription Title</label>

              <input
                type="text"
                placeholder="Example: Blood Test Prescription"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label>Prescription Image</label>

              <label className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 px-4 py-4 cursor-pointer transition duration-150 hover:border-blue-500 hover:bg-blue-50">
                <ImageIcon size={20} className="text-blue-600" />

                <span className="text-sm text-slate-600">
                  {file ? file.name : "Choose prescription image"}
                </span>

                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
            </div>

            <button onClick={handleUpload} className="btn-primary w-full">
              <Upload size={18} />

              {loading ? "Uploading..." : "Upload Prescription"}
            </button>
          </div>
        </aside>
      </div>

      {/* Preview Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-slate-900/70 flex items-center justify-center z-50 p-5"
          onClick={() => {
            setSelected(null);
            resetZoom();
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-5xl w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {selected.title}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {new Date(selected.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
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
                  onClick={() => {
                    setSelected(null);
                    resetZoom();
                  }}
                  className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-500 transition"
                  title="Close"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Image Preview */}
            <div className="image-preview-scroll flex justify-center items-start bg-slate-100 rounded-xl p-4 h-[75vh] overflow-auto">
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
          </div>
        </div>
      )}
    </div>
  );
}
