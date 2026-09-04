// src/components/PrescriptionCard.jsx

import { CalendarDays, Eye, Trash2 } from "lucide-react";

function PrescriptionCard({ prescription, onOpen, onDelete }) {
  const createdDate = prescription.createdAt
    ? new Date(prescription.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown date";

  return (
    <article className="ms-card ms-prescription-card">
      <button
        type="button"
        className="ms-prescription-card-image-button"
        onClick={() => onOpen(prescription)}
        aria-label={`View ${prescription.title}`}
      >
        <div className="ms-prescription-card-image">
          <img
            src={prescription.imageUrl}
            alt={prescription.title}
            loading="lazy"
          />

          <span className="ms-prescription-card-overlay">
            <Eye size={21} strokeWidth={1.8} />
            <span>View</span>
          </span>
        </div>
      </button>

      <div className="ms-prescription-card-content">
        <div className="ms-prescription-card-main">
          <h3 className="ms-prescription-card-title" title={prescription.title}>
            {prescription.title}
          </h3>

          <div className="ms-prescription-card-meta">
            <CalendarDays size={15} strokeWidth={1.8} />
            <span>{createdDate}</span>
          </div>
        </div>

        <button
          type="button"
          className="ms-icon-button ms-prescription-card-delete"
          onClick={() => onDelete(prescription._id)}
          aria-label={`Delete ${prescription.title}`}
          title="Delete prescription"
        >
          <Trash2 size={17} strokeWidth={1.8} />
        </button>
      </div>
    </article>
  );
}

export default PrescriptionCard;
