// client/src/components/medicine/MedicineCardContent.jsx

// Renders the medicine summary card and its interactive controls.
// Displays treatment status, dosage, usage, pricing, and actions.

import {
  CalendarDays,
  CircleDollarSign,
  Clock3,
  ImageOff,
  Pencil,
  Pill,
  Trash2,
} from "lucide-react";

import { formatMedicinePrice } from "../../utils/medicine/medicineCalculations";

import {
  formatDate,
  formatDosageTime,
  getMedicineTypeLabel,
} from "../../utils/medicine/medicineHelpers";

export default function MedicineCardContent({
  medicine,
  isStripMedicine,
  monthlyPieces,
  monthlyCost,
  isActive,
  dosage,
  onCardClick,
  onView,
  onEdit,
  onDelete,
  onStopCardClick,
}) {
  return (
    <article
      onClick={onCardClick}
      className="card cursor-pointer overflow-hidden transition hover:border-sky-200 hover:shadow-md"
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        // Supports keyboard activation of the medicine card.
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onView(medicine);
        }
      }}
      aria-label={`View ${medicine?.name || "medicine"} details`}
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Displays the medicine image or an empty-image placeholder. */}
        <div className="relative shrink-0" onClick={onStopCardClick}>
          {medicine?.imageUrl ? (
            <button
              type="button"
              onClick={() => onView(medicine)}
              className="block overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
              aria-label={`View ${medicine.name} image`}
            >
              <img
                src={medicine.imageUrl}
                alt={medicine.name || "Medicine"}
                className="h-32 w-full object-contain sm:w-32"
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onView(medicine)}
              className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 sm:w-32"
              aria-label={`View ${medicine.name} details`}
            >
              <ImageOff size={22} />
              <span className="text-xs">No image</span>
            </button>
          )}
        </div>

        {/* Displays medicine metadata, actions, dosage, and usage details. */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <Pill size={17} className="shrink-0 text-sky-600" />

                  <h3 className="truncate text-base font-semibold text-slate-900">
                    {medicine?.name || "Unnamed medicine"}
                  </h3>
                </div>

                {/* Identifies the medicine category. */}
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {getMedicineTypeLabel(medicine?.type)}
                </span>

                {/* Indicates whether the treatment is currently active. */}
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {isActive ? "Currently taking" : "Completed"}
                </span>
              </div>

              {/* Displays treatment start and completion dates. */}
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  Started {formatDate(medicine?.startDate)}
                </span>

                {!isActive && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={14} />
                    Ended {formatDate(medicine?.endDate)}
                  </span>
                )}
              </div>
            </div>

            {/* Provides quick view, edit, and delete actions. */}
            <div
              className="flex shrink-0 items-center gap-1"
              onClick={onStopCardClick}
            >
              <button
                type="button"
                onClick={() => onView(medicine)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label={`View ${medicine.name}`}
                title="View"
              >
                <Pill size={17} />
              </button>

              <button
                type="button"
                onClick={onEdit}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-sky-50 hover:text-sky-600"
                aria-label={`Edit ${medicine.name}`}
                title="Edit"
              >
                <Pencil size={17} />
              </button>

              <button
                type="button"
                onClick={onDelete}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                aria-label={`Delete ${medicine.name}`}
                title="Delete"
              >
                <Trash2 size={17} />
              </button>
            </div>
          </div>

          {/* Displays dosage schedule when strip-based dosage is applicable. */}
          {isStripMedicine && (
            <div className="mt-4 rounded-xl bg-slate-50 p-3">
              <div className="mb-2 flex items-center gap-2">
                <Clock3 size={15} className="text-slate-500" />

                <span className="text-xs font-semibold text-slate-600">
                  Dosage schedule
                </span>
              </div>

              {dosage.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {dosage.map((item) => (
                    <div
                      key={item.time}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2"
                    >
                      <p className="text-xs font-medium text-slate-700">
                        {formatDosageTime(item.time)}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {item.quantity}{" "}
                        {Number(item.quantity) === 1 ? "piece" : "pieces"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  No dosage schedule recorded.
                </p>
              )}
            </div>
          )}

          {/* Summarizes monthly cost and medicine consumption. */}
          <div className="mt-4 flex flex-wrap gap-4 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-2">
              <CircleDollarSign size={16} className="text-slate-400" />

              <div>
                <p className="text-[11px] text-slate-400">Monthly cost</p>

                <p className="text-sm font-semibold text-slate-700">
                  ৳{formatMedicinePrice(monthlyCost)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Pill size={16} className="text-slate-400" />

              <div>
                <p className="text-[11px] text-slate-400">Monthly usage</p>

                <p className="text-sm font-semibold text-slate-700">
                  {monthlyPieces}{" "}
                  {isStripMedicine
                    ? monthlyPieces === 1
                      ? "piece"
                      : "pieces"
                    : monthlyPieces === 1
                      ? "unit"
                      : "units"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
