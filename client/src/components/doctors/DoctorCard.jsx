import {
  BadgeCheck,
  Building2,
  Clock,
  Globe,
  GraduationCap,
  Hash,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Stethoscope,
  Trash2,
} from "lucide-react";

export default function DoctorCard({ doctor, onEdit, onDelete }) {
  const specialities = doctor.specialities || [];
  const degrees = doctor.degrees || [];
  const chambers = doctor.chambers || [];

  const phones = doctor.contactInfo?.phones || [];
  const emails = doctor.contactInfo?.emails || [];

  return (
    <article className="ms-card ms-doctor-card">
      {/* Header */}
      <div className="ms-doctor-card-header">
        <div className="ms-doctor-card-identity">
          <div className="ms-doctor-avatar">
            <Stethoscope size={24} aria-hidden="true" />
          </div>

          <div className="ms-doctor-card-name-group">
            <h3 className="ms-doctor-card-name">{doctor.name}</h3>

            <p className="ms-doctor-card-designation">
              {doctor.designation || "Doctor"}
            </p>
          </div>
        </div>

        {specialities.length > 0 && (
          <div className="ms-doctor-specialities">
            {specialities.map((speciality) => (
              <span key={speciality} className="ms-badge ms-doctor-speciality">
                {speciality}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Professional Information */}
      {(degrees.length > 0 || doctor.bmdcRegNo || doctor.primaryHospital) && (
        <section className="ms-doctor-info-section">
          <div className="ms-doctor-subsection-heading">
            <span>Professional Information</span>
          </div>

          <div className="ms-doctor-info-grid">
            {degrees.length > 0 && (
              <Info
                icon={<GraduationCap size={18} />}
                label="Degrees"
                value={degrees.join(", ")}
              />
            )}

            {doctor.bmdcRegNo && (
              <Info
                icon={<BadgeCheck size={18} />}
                label="BMDC Registration"
                value={doctor.bmdcRegNo}
              />
            )}

            {doctor.primaryHospital && (
              <Info
                icon={<Building2 size={18} />}
                label="Primary Hospital"
                value={doctor.primaryHospital}
              />
            )}
          </div>
        </section>
      )}

      {/* Chambers */}
      {chambers.length > 0 && (
        <section className="ms-doctor-info-section">
          <div className="ms-doctor-subsection-heading">
            <Stethoscope size={18} aria-hidden="true" />
            <span>Chambers</span>
          </div>

          <div className="ms-doctor-chamber-list">
            {chambers.map((chamber, index) => (
              <div
                key={chamber._id || index}
                className="ms-doctor-card-chamber"
              >
                <div className="ms-doctor-card-chamber-header">
                  <div>
                    <span className="ms-doctor-card-chamber-label">
                      Chamber {index + 1}
                    </span>

                    <p className="ms-doctor-card-chamber-name">
                      {chamber.name || `Chamber ${index + 1}`}
                    </p>
                  </div>
                </div>

                {chamber.address && (
                  <div className="ms-doctor-detail-row">
                    <MapPin size={16} aria-hidden="true" />

                    <span>{chamber.address}</span>
                  </div>
                )}

                {chamber.phone && (
                  <div className="ms-doctor-detail-row">
                    <Phone size={16} aria-hidden="true" />

                    <span>{chamber.phone}</span>
                  </div>
                )}

                {chamber.serialNumber && (
                  <div className="ms-doctor-detail-row">
                    <Hash size={16} aria-hidden="true" />

                    <span>Serial: {chamber.serialNumber}</span>
                  </div>
                )}

                {(chamber.visitingDays?.length > 0 || chamber.visitingTime) && (
                  <div className="ms-doctor-detail-row">
                    <Clock size={16} aria-hidden="true" />

                    <span>
                      {chamber.visitingDays?.join(", ") || "-"}

                      {chamber.visitingTime ? ` • ${chamber.visitingTime}` : ""}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      {(phones.length > 0 ||
        emails.length > 0 ||
        doctor.contactInfo?.website) && (
        <section className="ms-doctor-info-section">
          <div className="ms-doctor-subsection-heading">
            <span>Contact Information</span>
          </div>

          <div className="ms-doctor-contact-list-card">
            {phones.map((phone) => (
              <div key={phone} className="ms-doctor-contact-item">
                <Phone size={17} aria-hidden="true" />

                <span>{phone}</span>
              </div>
            ))}

            {emails.map((email) => (
              <div key={email} className="ms-doctor-contact-item">
                <Mail size={17} aria-hidden="true" />

                <span>{email}</span>
              </div>
            ))}

            {/* {doctor.contactInfo?.website && (
              <div className="ms-doctor-contact-item">
                <Globe size={17} aria-hidden="true" />

                <span className="ms-break-word">
                  {doctor.contactInfo.website}
                </span>
              </div>
            )} */}
          </div>
        </section>
      )}

      {/* Social Links */}
      {/* {(doctor.contactInfo?.facebook || doctor.contactInfo?.linkedin) && (
        <div className="ms-doctor-social-links">
          {doctor.contactInfo.facebook && (
            <span className="ms-doctor-social-item">
              Facebook: {doctor.contactInfo.facebook}
            </span>
          )}

          {doctor.contactInfo.linkedin && (
            <span className="ms-doctor-social-item">
              LinkedIn: {doctor.contactInfo.linkedin}
            </span>
          )}
        </div>
      )} */}

      {/* Notes */}
      {/* {doctor.notes && (
        <div className="ms-doctor-notes">
          <span className="ms-doctor-notes-label">Notes</span>

          <p>{doctor.notes}</p>
        </div>
      )} */}

      {/* Actions */}
      {(onEdit || onDelete) && (
        <div className="ms-doctor-card-actions">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(doctor)}
              className="ms-btn ms-btn-secondary ms-doctor-action-button"
            >
              <Pencil size={16} aria-hidden="true" />
              Edit
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(doctor._id)}
              className="ms-btn ms-btn-danger ms-doctor-action-button"
            >
              <Trash2 size={16} aria-hidden="true" />
              Delete
            </button>
          )}
        </div>
      )}
    </article>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="ms-doctor-info-item">
      <div className="ms-doctor-info-icon">{icon}</div>

      <div className="ms-doctor-info-content">
        <p className="ms-doctor-info-label">{label}</p>

        <p className="ms-doctor-info-value">{value || "-"}</p>
      </div>
    </div>
  );
}
