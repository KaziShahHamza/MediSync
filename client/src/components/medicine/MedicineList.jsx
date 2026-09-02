// client/src/components/medicine/MedicineList.jsx

import {
  Pill,
  Pencil,
  Trash2,
  Clock3,
  ImageOff,
  CalendarDays,
  History,
} from "lucide-react";

const formatMonthYear = (date) => {
  if (!date) return "Present";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

export default function MedicineList({ medicines, onEdit, onDelete }) {
  const activeMedicines = medicines.filter((med) => med.isActive);
  const pastMedicines = medicines.filter((med) => !med.isActive);

  const renderMedicine = (med) => (
    <div key={med._id} className="card">
      {" "}
      <div className="flex gap-5 items-center">
        {/* Medicine Image */}{" "}
        <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
          {med.imageUrl ? (
            <img
              src={med.imageUrl}
              alt={med.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <ImageOff size={28} className="text-slate-400" />
          )}{" "}
        </div>
        {/* Medicine Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-slate-900">{med.name}</h3>

          {/* Medicine Duration */}
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            <CalendarDays size={16} />

            <span>
              {formatMonthYear(med.startDate)} –{" "}
              {med.isActive ? "Present" : formatMonthYear(med.endDate)}
            </span>
          </div>

          {/* Dosage Schedule */}
          {med.dosageTimes?.length > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <Clock3 size={16} />

              <span>
                {med.dosageTimes
                  .map((time) => time.charAt(0).toUpperCase() + time.slice(1))
                  .join(", ")}
              </span>
            </div>
          )}
        </div>
        {/* Actions */}
        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={() => onEdit(med)}
            className="btn-secondary px-3 py-2 text-sm"
          >
            <Pencil size={16} />
            Edit
          </button>

          <button
            onClick={() => onDelete(med._id)}
            className="btn-danger px-3 py-2 text-sm"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (!medicines.length) {
    return (
      <div className="card text-center py-12">
        {" "}
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto">
          {" "}
          <Pill size={32} className="text-blue-600" />{" "}
        </div>
        <h3 className="mt-5 text-xl font-semibold text-slate-900">
          No medicines added
        </h3>
        <p className="mt-2 text-slate-500">
          Add your medicines to keep track of your medication history.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Active Medicines */}
      {activeMedicines.length > 0 && (
        <section>
          {" "}
          <div className="flex items-center gap-3 mb-5">
            {" "}
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              {" "}
              <Pill size={20} className="text-blue-600" />{" "}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Active Medicines
              </h2>

              <p className="text-sm text-slate-500">
                Medicines you are currently taking
              </p>
            </div>
          </div>
          <div className="space-y-5">{activeMedicines.map(renderMedicine)}</div>
        </section>
      )}

      {/* Medicine History */}
      {pastMedicines.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <History size={20} className="text-slate-600" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Past Medicines
              </h2>

              <p className="text-sm text-slate-500">
                Medicines you have taken in the past
              </p>
            </div>
          </div>

          <div className="space-y-5">{pastMedicines.map(renderMedicine)}</div>
        </section>
      )}
    </div>
  );
}
