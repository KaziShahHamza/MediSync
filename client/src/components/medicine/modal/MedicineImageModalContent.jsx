// client/src/components/medicine/modal/MedicineImageModalContent.jsx

// Renders the complete visual layout of the medicine details modal.
// Displays treatment, dosage, pricing, status, and medicine image information.

import {
  CalendarDays,
  CircleDollarSign,
  Clock3,
  Package,
  Pill,
  X,
} from "lucide-react";

import MedicineImageViewer from "../MedicineImageViewer";

import { formatMedicinePrice } from "../../../utils/medicine/medicineCalculations";

import {
  formatDateLong,
  formatDosageTime,
  getMedicineTypeLabel,
} from "../../../utils/medicine/medicineHelpers";

export default function MedicineImageModalContent({
  medicine,
  isStripMedicine,
  dosage,
  monthlyPieces,
  pricePerPiece,
  monthlyCost,
  isActive,
  zoom,
  onClose,
  onZoomIn,
  onZoomOut,
  onOverlayClick,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
      onMouseDown={onOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`${medicine.name} details`}
    >
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Displays medicine identity, type, and modal close action. */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <Pill size={18} className="text-sky-600" />

                <h2 className="truncate text-base font-semibold text-slate-900">
                  {medicine.name || "Medicine details"}
                </h2>
              </div>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {getMedicineTypeLabel(medicine.type)}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Detailed medicine information
            </p>
          </div>

          {/* Provides the primary modal close control. */}
          <button
            type="button"
            onClick={onClose}
            className="ml-4 shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close medicine details"
          >
            <X size={20} />
          </button>
        </div>

        {/* Separates the medicine image viewer from detailed information. */}
        <div className="grid min-h-0 overflow-y-auto lg:grid-cols-2">
          <div className="p-5">
            <MedicineImageViewer
              imageUrl={medicine.imageUrl}
              medicineName={medicine.name}
              zoom={zoom}
              onZoomIn={onZoomIn}
              onZoomOut={onZoomOut}
            />
          </div>

          <div className="space-y-5 border-t border-slate-100 p-5 lg:border-l lg:border-t-0">
            {/* Presents treatment start, current status, and completion date. */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <CalendarDays size={17} className="text-sky-600" />

                <h3 className="text-sm font-semibold text-slate-900">
                  Treatment period
                </h3>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Started</p>

                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {formatDateLong(medicine.startDate)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Status</p>

                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {isActive ? "Currently taking" : "Completed"}
                  </p>
                </div>

                {/* Shows the end date only for completed treatments. */}
                {!isActive && (
                  <div className="rounded-xl bg-slate-50 p-3 sm:col-span-2 lg:col-span-1 xl:col-span-2">
                    <p className="text-xs text-slate-500">Ended</p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {formatDateLong(medicine.endDate)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Displays dosage schedule details for strip-based medicines. */}
            {isStripMedicine && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Clock3 size={17} className="text-sky-600" />

                  <h3 className="text-sm font-semibold text-slate-900">
                    Dosage schedule
                  </h3>
                </div>

                {dosage.length > 0 ? (
                  <div className="space-y-2">
                    {dosage.map((item) => (
                      <div
                        key={item.time}
                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
                      >
                        <span className="text-sm font-medium text-slate-700">
                          {formatDosageTime(item.time)}
                        </span>

                        <span className="text-sm text-slate-500">
                          {item.quantity}{" "}
                          {Number(item.quantity) === 1 ? "piece" : "pieces"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-500">
                    No dosage schedule recorded.
                  </p>
                )}
              </div>
            )}

            {/* Displays pricing information based on the medicine pricing model. */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <CircleDollarSign size={17} className="text-sky-600" />

                <h3 className="text-sm font-semibold text-slate-900">
                  Pricing
                </h3>
              </div>

              {isStripMedicine ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Price per strip</p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      ৳{formatMedicinePrice(medicine.pricePerStrip)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Pieces per strip</p>

                    <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                      <Package size={14} />
                      {medicine.piecesPerStrip || 0}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Price per piece</p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      ৳{formatMedicinePrice(pricePerPiece)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Monthly usage</p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {monthlyPieces} pieces
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Price per unit</p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      ৳{formatMedicinePrice(medicine.pricePerUnit)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Monthly usage</p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {monthlyPieces} units
                    </p>
                  </div>
                </div>
              )}

              {/* Highlights the calculated estimated monthly medicine cost. */}
              <div className="mt-3 flex items-center justify-between rounded-xl border border-sky-100 bg-sky-50 px-4 py-3">
                <span className="text-sm text-slate-600">
                  Estimated monthly cost
                </span>

                <span className="text-base font-bold text-sky-700">
                  ৳{formatMedicinePrice(monthlyCost)}
                </span>
              </div>
            </div>

            <p className="border-t border-slate-100 pt-4 text-xs leading-5 text-slate-400">
              Monthly cost is an estimate based on the recorded dosage or
              monthly usage and the medicine price entered in MediSync.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
