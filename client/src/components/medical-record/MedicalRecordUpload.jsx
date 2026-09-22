// client/src/components/medical-records/MedicalRecordUpload.jsx

// Form component for entering details and uploading medical image documents.

import { Upload, Image as ImageIcon, Sparkles } from "lucide-react";

// Sidebar upload form UI component
export default function MedicalRecordUpload({
  config,
  title,
  file,
  loading,
  uploadStatus,
  onTitleChange,
  onFileChange,
  onUpload,
}) {
  return (
    // Sticky sidebar wrapper card
    <aside className="card sticky top-24">
      {/* Upload card heading area */}
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h2 className="card-title">{config.uploadTitle}</h2>

          <p className="text-sm text-slate-500">{config.uploadDescription}</p>
        </div>
      </div>

      {/* Input controls fields wrapper */}
      <div className="space-y-5">
        {/* Document title input field */}
        <div>
          <label>{config.titleLabel}</label>

          <input
            type="text"
            placeholder={config.titlePlaceholder}
            value={title}
            disabled={loading}
            onChange={(e) => onTitleChange(e.target.value)}
            className="input"
          />
        </div>

        {/* Document file picker field */}
        <div>
          <label>{config.imageLabel}</label>

          <label
            className={`flex items-center gap-3 rounded-xl border border-dashed border-slate-300 px-4 py-4 transition duration-150 ${
              loading
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer hover:border-blue-500 hover:bg-blue-50"
            }`}
          >
            <ImageIcon size={20} className="text-blue-600" />

            <span className="text-sm text-slate-600 truncate">
              {file ? file.name : config.imagePlaceholder}
            </span>

            {/* Hidden HTML file upload input */}
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
              disabled={loading}
              onChange={onFileChange}
            />
          </label>
        </div>

        {/* Upload progress message banner */}
        {loading && uploadStatus && (
          <div className="flex items-center gap-3 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
            <Sparkles
              size={18}
              className="text-blue-600 animate-pulse shrink-0"
            />

            <p className="text-sm text-blue-700">{uploadStatus}</p>
          </div>
        )}

        {/* Submit button trigger */}
        <button
          type="button"
          onClick={onUpload}
          disabled={loading}
          className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Upload size={18} />

          {loading ? uploadStatus || "Processing..." : config.uploadButton}
        </button>

        {/* AI feature notification notice */}
        <p className="text-xs text-slate-400 leading-relaxed">
          {config.aiDescription}
        </p>
      </div>
    </aside>
  );
}
