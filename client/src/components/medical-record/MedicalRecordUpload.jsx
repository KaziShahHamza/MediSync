// client/src/components/medical-records/MedicalRecordUpload.jsx

// Provides the medical record title and image upload controls.
// Displays upload progress and the configured AI processing information.

import { Image as ImageIcon, Sparkles, Upload } from "lucide-react";

// Renders the sticky medical record upload form.
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
  // Uses the selected file name as the upload field preview when available.
  const fileName = file ? file.name : config.imagePlaceholder;

  // Uses a consistent upload button label based on the current state.
  const buttonLabel = loading
    ? uploadStatus || "Processing..."
    : config.uploadButton;

  return (
    <aside className="card sticky top-24">
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h2 className="card-title">{config.uploadTitle}</h2>

          <p className="text-sm text-slate-500">{config.uploadDescription}</p>
        </div>
      </div>

      {/* Groups the title, file picker, progress message, and submit action. */}
      <div className="space-y-5">
        <div>
          <label>{config.titleLabel}</label>

          <input
            type="text"
            placeholder={config.titlePlaceholder}
            value={title}
            disabled={loading}
            onChange={(event) => onTitleChange(event.target.value)}
            className="input"
          />
        </div>

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

            <span className="text-sm text-slate-600 truncate">{fileName}</span>

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
              disabled={loading}
              onChange={onFileChange}
            />
          </label>
        </div>

        {/* Displays processing status while an upload is being handled. */}
        {loading && uploadStatus && (
          <div className="flex items-center gap-3 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
            <Sparkles
              size={18}
              className="text-blue-600 animate-pulse shrink-0"
            />

            <p className="text-sm text-blue-700">{uploadStatus}</p>
          </div>
        )}

        <button
          type="button"
          onClick={onUpload}
          disabled={loading}
          className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Upload size={18} />

          {buttonLabel}
        </button>

        <p className="text-xs text-slate-400 leading-relaxed">
          {config.aiDescription}
        </p>
      </div>
    </aside>
  );
}
