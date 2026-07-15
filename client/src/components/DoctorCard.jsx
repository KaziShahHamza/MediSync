export default function DoctorCard({
  doctor,
  onEdit,
  onDelete,
}) {
  return (
    <div className="card p-5">

      <h3 className="text-xl font-semibold">
        {doctor.name}
      </h3>

        <p className="text-sky-600">
        {doctor.designation} {doctor.specialty}
        </p>

      <div className="mt-3 text-sm text-slate-600 space-y-1">

        <p>
          Hospital: {doctor.hospital || "-"}
        </p>

        <p>
          Chamber: {doctor.chamber || "-"}
        </p>

        <p>
          Visiting Days: {doctor.visitingDays || "-"}
        </p>

        <p>
          Visiting Time: {doctor.visitingTime || "-"}
        </p>

        <p>
          Phone: {doctor.phone || "-"}
        </p>

        {doctor.notes && (
          <p>
            Notes: {doctor.notes}
          </p>
        )}

      </div>

      <div className="flex gap-3 mt-5">

        <button
          onClick={() => onEdit(doctor)}
          className="btn-primary"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(doctor._id)}
          className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
        >
          Delete
        </button>

      </div>

    </div>
  );
}