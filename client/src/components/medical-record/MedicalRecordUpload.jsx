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
  disabled = false,
  onTitleChange,
  onFileChange,
  onUpload,
}) {
  // Uses the selected file name as the upload field preview when available.
  const fileName = file ? file.name : config.imagePlaceholder;

  // Uses a consistent upload button label based on the current state.
  const buttonLabel = loading
    ? uploadStatus || "Processing..."
    : disabled
      ? `Maximum ${config.plural} reached`
      : config.uploadButton;

  // Prevents all upload controls while processing or when the record limit is reached.
  const controlsDisabled = loading || disabled;

  return (
    <aside className="card sticky top-24">
      <div className="mb-6 flex items-center gap-3">
        <div>
          <h2 className="card-title">{config.uploadTitle}</h2>

          <p className="text-sm text-slate-500">{config.uploadDescription}</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label>{config.titleLabel}</label>

          <input
            type="text"
            placeholder={config.titlePlaceholder}
            value={title}
            disabled={controlsDisabled}
            onChange={(event) => onTitleChange(event.target.value)}
            className="input"
          />
        </div>

        <div>
          <label>{config.imageLabel}</label>

          <label
            className={`flex items-center gap-3 rounded-xl border border-dashed border-slate-300 px-4 py-4 transition duration-150 ${
              controlsDisabled
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer hover:border-blue-500 hover:bg-blue-50"
            }`}
          >
            <ImageIcon size={20} className="text-blue-600" />

            <span className="truncate text-sm text-slate-600">{fileName}</span>

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
              disabled={controlsDisabled}
              onChange={onFileChange}
            />
          </label>
        </div>

        {loading && uploadStatus && (
          <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
            <Sparkles
              size={18}
              className="shrink-0 animate-pulse text-blue-600"
            />

            <p className="text-sm text-blue-700">{uploadStatus}</p>
          </div>
        )}

        {disabled && !loading && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm text-slate-600">
              You have reached the maximum of {config.plural} allowed. Delete an
              existing {config.singular} to upload a new one.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onUpload}
          disabled={controlsDisabled}
          className="btn-primary flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Upload size={18} />
          {buttonLabel}
        </button>

        <p className="text-xs leading-relaxed text-slate-400">
          {config.aiDescription}
        </p>
      </div>
    </aside>
  );
}
