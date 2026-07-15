export default function DoctorCard({
  doctor,
  onEdit,
  onDelete,
}) {
  return (
    <div className="card p-5 hover:shadow-lg transition-shadow duration-200 border border-slate-100">

      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold leading-tight">
            {doctor.name}
          </h3>

          <p className="mt-1 text-sm text-sky-700 font-medium">
            {doctor.designation || "Doctor"}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
          {doctor.specialty || "Specialist"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-600">
        <div className="rounded-lg bg-slate-50 px-3 py-2">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Hospital
          </p>
          <p className="mt-1 font-medium text-slate-800">
            {doctor.hospital || "-"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Chamber
            </p>
            <p className="mt-1 font-medium text-slate-800 line-clamp-2">
              {doctor.chamber || "-"}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Phone
            </p>
            <p className="mt-1 font-medium text-slate-800">
              {doctor.phone || "-"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Visiting Days
            </p>
            <p className="mt-1 font-medium text-slate-800">
              {Array.isArray(doctor.visitingDays) && doctor.visitingDays.length
                ? doctor.visitingDays.join(", ")
                : "-"}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Visiting Time
            </p>
            <p className="mt-1 font-medium text-slate-800">
              {doctor.visitingTime || "-"}
            </p>
          </div>
        </div>

        {doctor.notes && (
          <div className="rounded-lg border border-dashed border-slate-200 px-3 py-2 text-sm text-slate-600">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Notes
            </p>
            <p className="mt-1 line-clamp-3">
              {doctor.notes}
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={() => onEdit(doctor)}
          className="btn-primary flex-1"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(doctor._id)}
          className="flex-1 rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition-colors hover:bg-red-600"
        >
          Delete
        </button>

      </div>

    </div>
  );
}