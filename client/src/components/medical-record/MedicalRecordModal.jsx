// client/src/components/medical-record/MedicalRecordModal.jsx

// Displays enlarged record view modal with interactive image controls and AI summary.

import {
  X,
  Sparkles,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

// Modal component for viewing document details and AI summary
export default function MedicalRecordModal({
  record,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onClose,
  config,
}) {
  // Return null if no record is selected
  if (!record) return null;

  return (
    // Dark overlay backdrop wrapper
    <div
      className="fixed inset-0 bg-slate-900/70 flex items-center justify-center z-50 p-5"
      onClick={onClose}
    >
      {/* Modal content dialog card */}
      <div
        className="bg-white rounded-2xl max-w-7xl w-full max-h-[92vh] p-6 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header with title and control bar */}
        <div className="flex justify-between items-center mb-5 shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {record.title}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {new Date(record.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Zoom and close action toolbar */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onZoomOut}
              disabled={zoom <= 0.5}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition"
              title="Zoom out"
            >
              <ZoomOut size={20} />
            </button>

            <span className="text-sm text-slate-600 min-w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>

            <button
              type="button"
              onClick={onZoomIn}
              disabled={zoom >= 3}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition"
              title="Zoom in"
            >
              <ZoomIn size={20} />
            </button>

            <button
              type="button"
              onClick={onResetZoom}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition"
              title="Reset zoom"
            >
              <RotateCcw size={19} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-500 transition"
              title="Close"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Modal main content split area */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 min-h-0 flex-1">
          {/* Scrollable document image viewport */}
          <div className="image-preview-scroll flex justify-center items-start bg-slate-100 rounded-xl p-4 min-h-[50vh] lg:h-[70vh] overflow-auto">
            <img
              src={record.imageUrl}
              alt={record.title}
              className="rounded-xl object-contain transition-all duration-200"
              style={{
                width: `${zoom * 100}%`,
                maxWidth: "none",
                transformOrigin: "top center",
              }}
            />
          </div>

          {/* Sidebar displaying document AI summary */}
          <aside className="rounded-xl border border-slate-200 bg-slate-50 p-5 overflow-auto">
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-lg bg-blue-50 p-2">
                <Sparkles size={18} className="text-blue-600" />
              </div>

              <h3 className="font-semibold text-slate-900">AI Summary</h3>
            </div>

            {/* Conditional AI summary text or fallback warning block */}
            {record.aiSummary ? (
              <p className="text-sm leading-7 text-slate-700 whitespace-pre-line">
                {record.aiSummary}
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
                    This {config.singular} was uploaded successfully, but its AI
                    analysis could not be completed.
                  </p>
                </div>
              </div>
            )}

            {/* Medical disclaimer note footer */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <p className="text-xs leading-5 text-slate-400">
                AI-generated summaries are for informational purposes and may
                not accurately interpret all medical information. Always consult
                a qualified healthcare professional.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
