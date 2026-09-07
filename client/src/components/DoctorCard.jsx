// client/src/components/DoctorCard.jsx

import {
  BadgeCheck,
  Building2,
  GraduationCap,
  Pencil,
  Stethoscope,
  Trash2,
} from "lucide-react";

export default function DoctorCard({ doctor, onEdit, onDelete, onOpen }) {
  const specialities = doctor.specialities || [];
  const degrees = doctor.degrees || [];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(doctor)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(doctor);
        }
      }}
      className="card cursor-pointer transition hover:border-blue-200 hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-xl font-semibold text-slate-900">
            {doctor.name}
          </h3>

          <p className="mt-1 font-medium text-blue-600">
            {doctor.designation || "Doctor"}
          </p>
        </div>

        <Stethoscope size={24} className="shrink-0 text-blue-600" />
      </div>

      {/* Specialities */}
      {specialities.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {specialities.map((speciality) => (
            <span
              key={speciality}
              className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600"
            >
              {speciality}
            </span>
          ))}
        </div>
      )}

      {/* Professional Information */}
      {(degrees.length > 0) && (
        <div className="mt-5 space-y-3">
          {degrees.length > 0 && (
            <Info
              icon={<GraduationCap size={17} />}
              label="Degrees"
              value={degrees.join(", ")}
            />
          )}

        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onEdit(doctor);
          }}
          className="btn-secondary flex flex-1 items-center justify-center gap-2"
        >
          <Pencil size={16} />
          Edit
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(doctor._id);
          }}
          className="btn-danger flex flex-1 items-center justify-center gap-2"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="flex gap-3 rounded-xl bg-slate-50 p-3">
      <div className="mt-1 shrink-0 text-blue-600">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>

        <p className="mt-1 break-words font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}
