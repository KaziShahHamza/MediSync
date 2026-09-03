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
    <article key={med._id} className="ms-card ms-medicine-card">
      <div className="ms-medicine-card-main">
        {/* Medicine Image */}
        <div className="ms-medicine-image">
          {med.imageUrl ? (
            <img
              src={med.imageUrl}
              alt={med.name}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <ImageOff size={28} aria-hidden="true" />
          )}
        </div>

        {/* Medicine Details */}
        <div className="ms-medicine-details">
          <div className="ms-medicine-name-row">
            <h3 className="ms-medicine-name">{med.name}</h3>

            <span
              className={`ms-badge ${
                med.isActive
                  ? "ms-medicine-status-active"
                  : "ms-medicine-status-past"
              }`}
            >
              {med.isActive ? "Active" : "Past"}
            </span>
          </div>

          {/* Medicine Duration */}
          <div className="ms-medicine-meta">
            <CalendarDays size={16} aria-hidden="true" />

            <span>
              {formatMonthYear(med.startDate)} –{" "}
              {med.isActive ? "Present" : formatMonthYear(med.endDate)}
            </span>
          </div>

          {/* Dosage Schedule */}
          {med.dosageTimes?.length > 0 && (
            <div className="ms-medicine-meta">
              <Clock3 size={16} aria-hidden="true" />

              <span>
                {med.dosageTimes
                  .map((time) => time.charAt(0).toUpperCase() + time.slice(1))
                  .join(", ")}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="ms-medicine-actions">
          <button
            type="button"
            onClick={() => onEdit(med)}
            className="ms-btn ms-btn-secondary ms-medicine-action"
            aria-label={`Edit ${med.name}`}
          >
            <Pencil size={16} aria-hidden="true" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => onDelete(med._id)}
            className="ms-btn ms-btn-danger ms-medicine-action"
            aria-label={`Delete ${med.name}`}
          >
            <Trash2 size={16} aria-hidden="true" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </article>
  );

  if (!medicines.length) {
    return (
      <div className="ms-card ms-empty-state ms-medicine-empty-state">
        <div className="ms-medicine-empty-icon">
          <Pill size={32} aria-hidden="true" />
        </div>

        <h3 className="ms-medicine-empty-title">No medicines added</h3>

        <p className="ms-medicine-empty-description">
          Add your medicines to keep track of your medication history.
        </p>
      </div>
    );
  }

  return (
    <div className="ms-medicine-sections">
      {/* Active Medicines */}
      {activeMedicines.length > 0 && (
        <section className="ms-medicine-group">
          <div className="ms-medicine-group-header">
            <div className="ms-icon-box ms-medicine-group-icon ms-medicine-group-icon-active">
              <Pill size={20} aria-hidden="true" />
            </div>

            <div>
              <h2 className="ms-medicine-group-title">Active Medicines</h2>

              <p className="ms-medicine-group-description">
                Medicines you are currently taking
              </p>
            </div>

            <span className="ms-badge ms-medicine-group-count">
              {activeMedicines.length}
            </span>
          </div>

          <div className="ms-medicine-items">
            {activeMedicines.map(renderMedicine)}
          </div>
        </section>
      )}

      {/* Medicine History */}
      {pastMedicines.length > 0 && (
        <section className="ms-medicine-group">
          <div className="ms-medicine-group-header">
            <div className="ms-icon-box ms-medicine-group-icon ms-medicine-group-icon-history">
              <History size={20} aria-hidden="true" />
            </div>

            <div>
              <h2 className="ms-medicine-group-title">Past Medicines</h2>

              <p className="ms-medicine-group-description">
                Medicines you have taken in the past
              </p>
            </div>

            <span className="ms-badge ms-medicine-group-count">
              {pastMedicines.length}
            </span>
          </div>

          <div className="ms-medicine-items">
            {pastMedicines.map(renderMedicine)}
          </div>
        </section>
      )}
    </div>
  );
}
