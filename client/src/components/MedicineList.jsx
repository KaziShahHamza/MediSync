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
  getMonthlyMedicineCost,
  getMonthlyMedicinePieces,
  formatMedicinePrice,
} from "../utils/medicineCalculations";

const formatMonthYear = (date) => {
  if (!date) return "Present";

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  ).format(new Date(date));
};

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

export default function MedicineList({
  medicines,
  onEdit,
  onDelete,
}) {
  const [selectedMedicine, setSelectedMedicine] =
    useState(null);

  const activeMedicines =
    medicines.filter(
      (med) => med.isActive,
    );

  const pastMedicines =
    medicines.filter(
      (med) => !med.isActive,
    );

  const renderMedicine = (med) => {
    const monthlyPieces =
      getMonthlyMedicinePieces(
        med.dosage,
      );

    const monthlyCost =
      getMonthlyMedicineCost(
        med.dosage,
        med.pricePerStrip,
        med.piecesPerStrip,
      );

    return (
      <div
        key={med._id}
        className={`card ${
          med.imageUrl
            ? "cursor-pointer transition hover:border-blue-200 hover:shadow-md"
            : ""
        }`}
        onClick={() => {
          if (med.imageUrl) {
            setSelectedMedicine(med);
          }
        }}
        role={
          med.imageUrl
            ? "button"
            : undefined
        }
        tabIndex={
          med.imageUrl
            ? 0
            : undefined
        }
        onKeyDown={(e) => {
          if (
            med.imageUrl &&
            (e.key === "Enter" ||
              e.key === " ")
          ) {
            e.preventDefault();
            setSelectedMedicine(med);
          }
        }}
      >
        <div className="flex items-center gap-5">
          {/* Medicine Image */}

          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {med.imageUrl ? (
              <img
                src={med.imageUrl}
                alt={med.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";

                  e.currentTarget.nextElementSibling.style.display =
                    "flex";
                }}
              />
            ) : null}

            <div
              className={`h-full w-full items-center justify-center ${
                med.imageUrl
                  ? "hidden"
                  : "flex"
              }`}
            >
              <ImageOff
                size={28}
                className="text-slate-400"
              />
            </div>
          </div>

          {/* Medicine Details */}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold text-slate-900">
                {med.name}
              </h3>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {getMedicineTypeLabel(
                  med.type,
                )}
              </span>
            </div>

            {/* Medicine Duration */}

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays size={16} />

              <span>
                {formatMonthYear(
                  med.startDate,
                )}{" "}
                –{" "}
                {med.isActive
                  ? "Present"
                  : formatMonthYear(
                      med.endDate,
                    )}
              </span>
            </div>

            {/* Dosage Schedule */}

            {med.dosage?.length > 0 && (
              <div className="mt-2 flex items-start gap-2 text-sm text-slate-500">
                <Clock3
                  size={16}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  {med.dosage
                    .map(
                      (item) =>
                        `${
                          item.time
                            .charAt(0)
                            .toUpperCase() +
                          item.time.slice(1)
                        } ${item.quantity}`,
                    )
                    .join(", ")}
                </span>
              </div>
            )}

            {/* Monthly Cost */}

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm font-medium text-blue-700">
                <CircleDollarSign
                  size={16}
                />

                <span>
                  {formatMedicinePrice(
                    monthlyCost,
                  )}
                  /month
                </span>
              </div>

              <span className="text-xs text-slate-400">
                {monthlyPieces} pieces/month
              </span>
            </div>
          </div>

          {/* Actions */}

          <div
            className="flex shrink-0 flex-col gap-2"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              onClick={() =>
                onEdit(med)
              }
              className="btn-secondary px-3 py-2 text-sm"
            >
              <Pencil size={16} />
              Edit
            </button>

            <button
              onClick={() =>
                onDelete(med._id)
              }
              className="btn-danger px-3 py-2 text-sm"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!medicines.length) {
    return (
      <div className="card py-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
          <Pill
            size={32}
            className="text-blue-600"
          />
        </div>

        <h3 className="mt-5 text-xl font-semibold text-slate-900">
          No medicines added
        </h3>

        <p className="mt-2 text-slate-500">
          Add your medicines to keep track
          of your medication history.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-10">
        {/* Active Medicines */}

        {activeMedicines.length > 0 && (
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Pill
                  size={20}
                  className="text-blue-600"
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Active Medicines
                </h2>

                <p className="text-sm text-slate-500">
                  Medicines you are
                  currently taking
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {activeMedicines.map(
                renderMedicine,
              )}
            </div>
          </section>
        )}

        {/* Medicine History */}

        {pastMedicines.length > 0 && (
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <History
                  size={20}
                  className="text-slate-600"
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Past Medicines
                </h2>

                <p className="text-sm text-slate-500">
                  Medicines you have taken
                  in the past
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {pastMedicines.map(
                renderMedicine,
              )}
            </div>
          </section>
        )}
      </div>

      {/* Medicine Image Modal */}

      {selectedMedicine && (
        <MedicineImageModal
          medicine={selectedMedicine}
          onClose={() =>
            setSelectedMedicine(null)
          }
        />
      )}
    </>
  );
}