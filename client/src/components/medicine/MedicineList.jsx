import { useState } from "react";

import {
  Pill,
  Pencil,
  Trash2,
  Clock3,
  ImageOff,
  CalendarDays,
  History,
  CircleDollarSign,
} from "lucide-react";

import MedicineImageModal from "./MedicineImageModal";

import {
  getMedicinePricingType,
  getMonthlyMedicinePieces,
  getPricePerPiece,
  getMedicineMonthlyCost,
  formatMedicinePrice,
} from "../../utils/medicineCalculations";

const getMedicineTypeLabel = (type) => {
  const labels = {
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

  return labels[type] || "Other";
};

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

const formatDosageTime = (time) => {
  if (!time) {
    return "";
  }

  return time.charAt(0).toUpperCase() + time.slice(1);
};

export default function MedicineList({
  medicines = [],
  onEdit,
  onDelete,
  loading = false,
}) {
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const activeMedicines = medicines.filter(
    (medicine) => medicine.isActive !== false,
  );

  const pastMedicines = medicines.filter(
    (medicine) => medicine.isActive === false,
  );

  /*
   * ========================================================
   * MEDICINE CARD
   * ========================================================
   */

  const renderMedicine = (medicine) => {
    const pricingType = getMedicinePricingType(medicine);

    const isStripMedicine = pricingType === "strip";

    const monthlyCost = getMedicineMonthlyCost(medicine);

    const monthlyPieces = isStripMedicine
      ? getMonthlyMedicinePieces(medicine.dosage)
      : 0;

    const pricePerPiece = isStripMedicine
      ? getPricePerPiece(medicine.pricePerStrip, medicine.piecesPerStrip)
      : 0;

    return (
      <article key={medicine._id} className="card overflow-hidden">
        {/* HEADER */}

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-lg font-semibold text-slate-900">
                {medicine.name}
              </h3>

              <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                {getMedicineTypeLabel(medicine.type)}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays size={15} />

              <span>Started {formatDate(medicine.startDate)}</span>
            </div>
          </div>

          {/* IMAGE */}

          {medicine.imageUrl ? (
            <button
              type="button"
              onClick={() => setSelectedMedicine(medicine)}
              className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
              title="View medicine image"
            >
              <img
                src={medicine.imageUrl}
                alt={medicine.name}
                className="h-full w-full object-contain transition group-hover:scale-105"
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSelectedMedicine(medicine)}
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400"
              title="View medicine details"
            >
              <ImageOff size={21} />
            </button>
          )}
        </div>

        {/* PRICING */}

        {/* DOSAGE — STRIP MEDICINES ONLY */}

        {isStripMedicine && (
          <div className="mt-5">
            <div className="flex items-center gap-2">
              <Clock3 size={17} className="text-blue-600" />

              <p className="text-sm font-semibold text-slate-800">
                Dosage schedule
              </p>

              {/* STATUS */}
              {medicine.isActive !== false ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Currently taking
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  <History size={13} />
                  Treatment completed
                </span>
              )}
            </div>

            {medicine.dosage?.length > 0 ? (
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {medicine.dosage.map((item) => (
                  <div
                    key={item.time}
                    className="rounded-lg bg-blue-50 px-3 py-2"
                  >
                    <p className="text-sm font-medium text-blue-600">
                      {formatDosageTime(item.time)}: {item.quantity}{" "}
                      {Number(item.quantity) === 1 ? "piece" : "pieces"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">
                No dosage schedule recorded.
              </p>
            )}
          </div>
        )}

        {/* ACTIONS */}

        <div className="mt-2 flex items-center justify-end gap-2 border-t border-slate-200 pt-2">
          <button
            type="button"
            onClick={() => setSelectedMedicine(medicine)}
            className="btn-secondary inline-flex items-center gap-2"
          >
            View
          </button>

          <button
            type="button"
            onClick={() => onEdit(medicine)}
            disabled={loading}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Pencil size={15} />
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(medicine._id)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      </article>
    );
  };

  /*
   * ========================================================
   * EMPTY STATE
   * ========================================================
   */

  if (medicines.length === 0) {
    return (
      <div className="card py-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Pill size={23} />
        </div>

        <h3 className="mt-4 text-lg font-semibold text-slate-900">
          No medicines yet
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
          Add your medicines to keep track of dosage, pricing and estimated
          monthly costs.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ACTIVE MEDICINES */}

      {activeMedicines.length > 0 && (
        <section>
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900">
              Current medicines
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Medicines you are currently taking.
            </p>
          </div>

          <div className="space-y-5">{activeMedicines.map(renderMedicine)}</div>
        </section>
      )}

      {/* PAST MEDICINES */}

      {pastMedicines.length > 0 && (
        <section className={activeMedicines.length > 0 ? "mt-10" : ""}>
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900">
              Past medicines
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Medicines from completed treatments.
            </p>
          </div>

          <div className="space-y-5">{pastMedicines.map(renderMedicine)}</div>
        </section>
      )}

      {/* IMAGE / DETAIL MODAL */}

      <MedicineImageModal
        medicine={selectedMedicine}
        onClose={() => setSelectedMedicine(null)}
      />
    </>
  );
}
