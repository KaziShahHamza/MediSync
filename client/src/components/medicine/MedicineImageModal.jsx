import { useEffect, useState } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  Pill,
  CalendarDays,
  Clock3,
  CircleDollarSign,
  Package,
} from "lucide-react";
import {
  getMedicinePricingType,
  getDailyMedicinePieces,
  getMonthlyMedicinePieces,
  getPricePerPiece,
  getMedicineMonthlyCost,
  formatMedicinePrice,
} from "../../utils/medicineCalculations";

const MEDICINE_TYPE_LABELS = {
  tablet: "Tablet",
  capsule: "Capsule",
  syrup: "Syrup",
  antibiotic: "Antibiotic",
  injection: "Injection",
  cream: "Cream",
  ointment: "Ointment",
  drops: "Drops",
  inhaler: "Inhaler",
  other: "Other",
};

const DOSAGE_TIME_LABELS = {
  morning: "Morning",
  noon: "Noon",
  night: "Night",
};

function formatDate(date) {
  if (!date) return "Not set";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not set";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function MedicineImageModal({ medicine, onClose }) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!medicine) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [medicine, onClose]);

  useEffect(() => {
    if (!medicine) return;

    setZoom(1);
  }, [medicine]);

  if (!medicine) {
    return null;
  }

  const pricingType = getMedicinePricingType(medicine);
  const isStripMedicine = pricingType === "strip";

  const dosage = Array.isArray(medicine.dosage) ? medicine.dosage : [];

  const dailyPieces = isStripMedicine ? getDailyMedicinePieces(dosage) : 0;

  const monthlyPieces = isStripMedicine ? getMonthlyMedicinePieces(dosage) : 0;

  const pricePerPiece = isStripMedicine
    ? getPricePerPiece(medicine.pricePerStrip, medicine.piecesPerStrip)
    : 0;

  const monthlyCost = getMedicineMonthlyCost(medicine);

  const typeLabel =
    MEDICINE_TYPE_LABELS[medicine.type] || medicine.type || "Medicine";

  const handleZoomIn = () => {
    setZoom((current) => Math.min(current + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((current) => Math.max(current - 0.25, 0.5));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Pill className="h-5 w-5 shrink-0 text-sky-600" />

              <h2 className="truncate text-lg font-semibold text-slate-800">
                {medicine.name}
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">{typeLabel}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-2">
          {/* Image */}
          <div className="flex min-h-[320px] items-center justify-center overflow-hidden bg-slate-100 p-6">
            {medicine.imageUrl ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                <div className="flex max-h-[65vh] w-full items-center justify-center overflow-auto">
                  <img
                    src={medicine.imageUrl}
                    alt={medicine.name}
                    className="max-h-[60vh] max-w-full rounded-xl object-contain shadow-sm transition-transform duration-200"
                    style={{
                      transform: `scale(${zoom})`,
                    }}
                  />
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white p-2 shadow-sm">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                    className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="h-5 w-5" />
                  </button>

                  <span className="min-w-[55px] text-center text-sm font-medium text-slate-600">
                    {Math.round(zoom * 100)}%
                  </span>

                  <button
                    type="button"
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                    className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-slate-400">
                <Pill className="mb-3 h-14 w-14" />

                <p className="text-sm font-medium">
                  No medicine image available
                </p>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-5 p-5 sm:p-6">
            {/* Treatment period */}
            <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-sky-600" />

                <h3 className="font-semibold text-slate-800">
                  Treatment Period
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Start Date
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {formatDate(medicine.startDate)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    End Date
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {medicine.endDate
                      ? formatDate(medicine.endDate)
                      : "Ongoing"}
                  </p>
                </div>
              </div>
            </section>

            {/* Strip medicine details */}
            {isStripMedicine ? (
              <>
                {/* Dosage schedule */}
                <section className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Clock3 className="h-5 w-5 text-sky-600" />

                    <h3 className="font-semibold text-slate-800">
                      Dosage Schedule
                    </h3>
                  </div>

                  {dosage.length > 0 ? (
                    <div className="space-y-2">
                      {dosage.map((dose, index) => (
                        <div
                          key={`${dose.time}-${index}`}
                          className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                        >
                          <span className="text-sm text-slate-600">
                            {DOSAGE_TIME_LABELS[dose.time] || dose.time}
                          </span>

                          <span className="text-sm font-semibold text-slate-800">
                            {dose.quantity} piece
                            {Number(dose.quantity) === 1 ? "" : "s"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      No dosage schedule available.
                    </p>
                  )}
                </section>

                {/* Strip pricing */}
                <section className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <CircleDollarSign className="h-5 w-5 text-sky-600" />

                    <h3 className="font-semibold text-slate-800">
                      Strip / পাতার Pricing
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Price / strip</p>

                      <p className="mt-1 font-semibold text-slate-800">
                        ৳{formatMedicinePrice(medicine.pricePerStrip)}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Pieces / strip</p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {medicine.piecesPerStrip || 0}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Price / piece</p>

                      <p className="mt-1 font-semibold text-slate-800">
                        ৳{formatMedicinePrice(pricePerPiece)}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Daily usage</p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {dailyPieces} piece
                        {dailyPieces === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-lg border border-sky-100 bg-sky-50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium text-sky-700">
                          Estimated monthly usage
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {monthlyPieces} pieces
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-medium text-sky-700">
                          Estimated monthly cost
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-800">
                          ৳{formatMedicinePrice(monthlyCost)}
                        </p>
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Estimated using a 30-day month.
                    </p>
                  </div>
                </section>
              </>
            ) : (
              /* Unit medicine details */
              <section className="rounded-xl border border-slate-200 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-sky-600" />

                  <h3 className="font-semibold text-slate-800">Unit Pricing</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Price / unit</p>

                    <p className="mt-1 font-semibold text-slate-800">
                      ৳{formatMedicinePrice(medicine.pricePerUnit)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Units / month</p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {medicine.unitsPerMonth || 0}
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-lg border border-sky-100 bg-sky-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-sky-700">
                        Estimated monthly usage
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {medicine.unitsPerMonth || 0} unit
                        {Number(medicine.unitsPerMonth) === 1 ? "" : "s"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-medium text-sky-700">
                        Estimated monthly cost
                      </p>

                      <p className="mt-1 text-lg font-bold text-slate-800">
                        ৳{formatMedicinePrice(monthlyCost)}
                      </p>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Based on the monthly units entered for this medicine.
                  </p>
                </div>
              </section>
            )}

            {/* Disclaimer */}
            <p className="text-xs leading-relaxed text-slate-400">
              Medicine cost and usage shown here are estimates based on the
              information entered in MediSync. They are not a substitute for
              instructions from a doctor or pharmacist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
