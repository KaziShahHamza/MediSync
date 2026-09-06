import { useState } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Clock3,
  CalendarDays,
  Pill,
  ImageOff,
} from "lucide-react";

const formatDate = (date) => {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export default function MedicineImageModal({ medicine, onClose }) {
  const [zoom, setZoom] = useState(1);

  if (!medicine) return null;

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-5"
      onClick={handleBackdropClick}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <Pill size={20} className="text-blue-600" />
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xl font-semibold text-slate-900">
                  {medicine.name}
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Medicine details
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="ml-4 flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={zoomOut}
              disabled={zoom <= 0.5}
              className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              title="Zoom out"
            >
              <ZoomOut size={20} />
            </button>

            <span className="min-w-12 text-center text-sm text-slate-600">
              {Math.round(zoom * 100)}%
            </span>

            <button
              type="button"
              onClick={zoomIn}
              disabled={zoom >= 3}
              className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              title="Zoom in"
            >
              <ZoomIn size={20} />
            </button>

            <button
              type="button"
              onClick={resetZoom}
              className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
              title="Reset zoom"
            >
              <RotateCcw size={19} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="ml-1 rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-500"
              title="Close"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid min-h-0 flex-1 lg:grid-cols-[1fr_320px]">
          {/* Image Preview */}
          <div className="image-preview-scroll flex min-h-[50vh] items-start justify-center overflow-auto bg-slate-100 p-6 lg:h-[70vh]">
            {medicine.imageUrl ? (
              <img
                src={medicine.imageUrl}
                alt={medicine.name}
                className="rounded-xl object-contain transition-all duration-200"
                style={{
                  width: `${zoom * 100}%`,
                  maxWidth: "none",
                  transformOrigin: "top center",
                }}
              />
            ) : (
              <div className="flex h-full min-h-[40vh] w-full items-center justify-center">
                <div className="text-center">
                  <ImageOff
                    size={48}
                    className="mx-auto text-slate-400"
                  />

                  <p className="mt-3 text-sm text-slate-500">
                    No medicine image available
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Medicine Information */}
          <aside className="overflow-auto border-l border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Medicine Information
            </h3>

            <div className="mt-5 space-y-5">
              {/* Medicine Name */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Medicine
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {medicine.name}
                </p>
              </div>

              {/* Dosage Times */}
              <div>
                <div className="flex items-center gap-2">
                  <Clock3 size={17} className="text-blue-600" />

                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Dosage Schedule
                  </p>
                </div>

                {medicine.dosageTimes?.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {medicine.dosageTimes.map((time) => (
                      <span
                        key={time}
                        className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                      >
                        {time.charAt(0).toUpperCase() + time.slice(1)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">
                    No dosage schedule recorded
                  </p>
                )}
              </div>

              {/* Treatment Period */}
              <div>
                <div className="flex items-center gap-2">
                  <CalendarDays size={17} className="text-blue-600" />

                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Treatment Period
                  </p>
                </div>

                <div className="mt-3 space-y-3">
                  <div>
                    <p className="text-xs text-slate-400">Started</p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {formatDate(medicine.startDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Status</p>

                    <p
                      className={`mt-1 text-sm font-medium ${
                        medicine.isActive
                          ? "text-emerald-600"
                          : "text-slate-700"
                      }`}
                    >
                      {medicine.isActive
                        ? "Currently taking"
                        : "Treatment completed"}
                    </p>
                  </div>

                  {!medicine.isActive && medicine.endDate && (
                    <div>
                      <p className="text-xs text-slate-400">Ended</p>

                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {formatDate(medicine.endDate)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 border-t border-slate-200 pt-4">
              <p className="text-xs leading-5 text-slate-400">
                Medicine information shown here is based on the record you
                saved in MediSync. Always follow your healthcare professional's
                instructions.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}