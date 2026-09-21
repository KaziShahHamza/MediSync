// client/src/components/doctor/DoctorCard.jsx

// Displays a compact doctor summary card with actions and chamber information.

import {
  Building2,
  GraduationCap,
  Pencil,
  Stethoscope,
  Trash2,
} from "lucide-react";

import DoctorChamber from "./DoctorChamber";
import { formatVisitFee } from "../../utils/doctor/doctorFunctions";

// Reusable labeled information row used inside the doctor card.
function Info({ icon, label, value }) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 shrink-0 text-slate-400">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="break-words text-sm font-medium text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}

// Main doctor card: summary, edit/delete actions, and chamber preview.
export default function DoctorCard({ doctor, onEdit, onDelete, onOpen }) {
  const specialities = doctor.specialities || [];
  const degrees = doctor.degrees || [];
  const chambers = doctor.chambers || [];

  // Used to decide whether the footer should show a visit fee.
  const hasVisitFee = chambers.some(
    (chamber) =>
      chamber.visitFee !== null &&
      chamber.visitFee !== undefined &&
      chamber.visitFee !== "",
  );

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(doctor)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(doctor);
        }
      }}
      className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Stethoscope size={22} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-slate-900">
              {doctor.name}
            </h3>

            {doctor.designation && (
              <p className="mt-0.5 text-sm text-slate-500">
                {doctor.designation}
              </p>
            )}
          </div>
        </div>

        {/* Card actions stay hidden on desktop until the card is hovered. */}
        <div
          className="flex shrink-0 gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => onEdit(doctor)}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
            aria-label={`Edit ${doctor.name}`}
          >
            <Pencil size={17} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(doctor._id)}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${doctor.name}`}
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      {/* Specialities */}
      {specialities.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {specialities.map((speciality) => (
            <span
              key={speciality}
              className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
            >
              {speciality}
            </span>
          ))}
        </div>
      )}

      {/* Professional information */}
      <div className="mt-5 space-y-3">
        <Info
          icon={<GraduationCap size={16} />}
          label="Degrees"
          value={degrees.join(", ")}
        />

        <Info
          icon={<Building2 size={16} />}
          label="Primary Hospital"
          value={doctor.primaryHospital}
        />

        {doctor.bmdcRegNo && (
          <Info
            icon={<Stethoscope size={16} />}
            label="BMDC Registration"
            value={doctor.bmdcRegNo}
          />
        )}
      </div>

      {/* Chambers */}
      {/* {chambers.length > 0 && (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-800">Chambers</h4>

            <span className="text-xs text-slate-400">
              {chambers.length} {chambers.length === 1 ? "chamber" : "chambers"}
            </span>
          </div>

          <div className="space-y-3">
            {chambers.slice(0, 2).map((chamber, index) => (
              <DoctorChamber
                key={`${doctor._id}-chamber-${index}`}
                chamber={chamber}
                index={index}
                compact
              />
            ))}
          </div>

          {chambers.length > 2 && (
            <p className="mt-3 text-center text-xs font-medium text-blue-600">
              +{chambers.length - 2} more chamber
              {chambers.length - 2 > 1 ? "s" : ""}
            </p>
          )}
        </div>
      )} */}

      {/* Footer */}
      {(doctor.lastVisit || hasVisitFee) && (
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
          {doctor.lastVisit && (
            <span>
              Last visit:{" "}
              <strong className="font-medium text-slate-700">
                {doctor.lastVisit}
              </strong>
            </span>
          )}

          {hasVisitFee && (
            <span>
              Visit fee:{" "}
              <strong className="font-medium text-slate-700">
                ৳
                {formatVisitFee(
                  chambers.find(
                    (chamber) =>
                      chamber.visitFee !== null &&
                      chamber.visitFee !== undefined &&
                      chamber.visitFee !== "",
                  )?.visitFee,
                )}
              </strong>
            </span>
          )}
        </div>
      )}
    </article>
  );
}
