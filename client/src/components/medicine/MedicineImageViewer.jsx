// client/src/components/medicine/MedicineImageViewer.jsx

// Displays a medicine image with zoom controls.
// Provides a fallback view when the medicine has no image.

import {
  ImageOff,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

// Renders scalable medicine image preview with interactive zoom tools.
export default function MedicineImageViewer({
  imageUrl,
  medicineName,
  zoom,
  onZoomIn,
  onZoomOut,
}) {
  // Empty state fallback when no image URL exists
  if (!imageUrl) {
    return (
      <div className="flex h-full min-h-80 items-center justify-center rounded-xl bg-slate-50">
        <div className="text-center">
          <ImageOff
            size={40}
            className="mx-auto text-slate-300"
          />

          <p className="mt-3 text-sm font-medium text-slate-500">
            No medicine image
          </p>

          <p className="mt-1 text-xs text-slate-400">
            No image was added for this medicine.
          </p>
        </div>
      </div>
    );
  }

  return (
    // Image viewer viewport
    <div className="relative flex min-h-80 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
      {/* Zoomable image container */}
      <div className="flex h-full w-full items-center justify-center overflow-auto p-6">
        <img
          src={imageUrl}
          alt={medicineName || "Medicine"}
          className="max-h-[520px] max-w-full object-contain transition-transform duration-200"
          style={{
            transform: `scale(${zoom})`,
          }}
        />
      </div>

      {/* Floating zoom control toolbar */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        {/* Zoom out action button */}
        <button
          type="button"
          onClick={onZoomOut}
          disabled={zoom <= 0.5}
          className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Zoom out"
          title="Zoom out"
        >
          <ZoomOut size={18} />
        </button>

        {/* Current zoom level percentage display */}
        <span className="min-w-12 text-center text-xs font-medium text-slate-600">
          {Math.round(zoom * 100)}%
        </span>

        {/* Zoom in action button */}
        <button
          type="button"
          onClick={onZoomIn}
          disabled={zoom >= 3}
          className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Zoom in"
          title="Zoom in"
        >
          <ZoomIn size={18} />
        </button>
      </div>
    </div>
  );
}