// client/src/components/doctor/DoctorModal.jsx

// Displays complete doctor information in a modal.
// Reuses DoctorInfo and DoctorChamber for consistent doctor details.

import {
  BadgeCheck,
  Building2,
  CalendarDays,
  GraduationCap,
  Pencil,
  X,
} from "lucide-react";

import DoctorChamber from "./DoctorChamber";
import DoctorInfo from "./DoctorInfo";

export default function DoctorModal({ doctor, onClose, onEdit }) {
  // Do not render the modal when no doctor is selected.
  if (!doctor) {
    return null;
  }

  const degrees = doctor.degrees || [];
  const specialities = doctor.specialities || [];
  const chambers = doctor.chambers || [];
  const phones = doctor.contactInfo?.phones || [];
  const emails = doctor.contactInfo?.emails || [];

  // Check whether any contact information is available.
  const hasContactInfo =
    phones.length > 0 ||
    emails.length > 0 ||
    Boolean(doctor.contactInfo?.website) ||
    Boolean(doctor.contactInfo?.facebook) ||
    Boolean(doctor.contactInfo?.linkedin);

  // Check whether professional information has anything to display.
  const hasProfessionalInfo =
    degrees.length > 0 ||
    Boolean(doctor.bmdcRegNo) ||
    Boolean(doctor.primaryHospital) ||
    Boolean(doctor.lastVisit);

  // Close the details modal before opening the edit form.
  function handleEdit() {
    onClose();
    onEdit(doctor);
  }

  // Reusable section wrapper for modal content.
  function Section({ title, children }) {
    return (
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </h3>

        {children}
      </section>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="doctor-modal-title"
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Modal header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2
              id="doctor-modal-title"
              className="text-xl font-semibold text-slate-900"
            >
              {doctor.name}
            </h2>

            {doctor.designation && (
              <p className="mt-1 text-sm text-slate-500">
                {doctor.designation}
              </p>
            )}

            {/* Doctor speciality badges */}
            {specialities.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
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
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close doctor details"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal content */}
        <div className="space-y-7 p-5 sm:p-6">
          {/* Professional information */}
          {hasProfessionalInfo && (
            <Section title="Professional Information">
              <div className="grid gap-3 sm:grid-cols-2">
                {doctor.bmdcRegNo && (
                  <DoctorInfo
                    icon={<BadgeCheck size={18} />}
                    label="BMDC Registration"
                    value={doctor.bmdcRegNo}
                  />
                )}

                {degrees.length > 0 && (
                  <DoctorInfo
                    icon={<GraduationCap size={18} />}
                    label="Degrees"
                    value={degrees.join(", ")}
                  />
                )}

                {doctor.primaryHospital && (
                  <DoctorInfo
                    icon={<Building2 size={18} />}
                    label="Primary Hospital"
                    value={doctor.primaryHospital}
                  />
                )}

                {doctor.lastVisit && (
                  <DoctorInfo
                    icon={<CalendarDays size={18} />}
                    label="Last Visit"
                    value={String(doctor.lastVisit)}
                  />
                )}
              </div>
            </Section>
          )}

          {/* Chamber information */}
          {chambers.length > 0 && (
            <Section title="Chambers">
              <div className="space-y-3">
                {chambers.map((chamber, index) => (
                  <DoctorChamber
                    key={`${doctor._id}-modal-chamber-${index}`}
                    chamber={chamber}
                    index={index}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Contact information */}
          {/* {hasContactInfo && (
            <Section title="Contact Information">
              <div className="grid gap-3 sm:grid-cols-2">
                {phones.length > 0 && (
                  <DoctorInfo
                    label="Phone"
                    value={phones.join(", ")}
                  />
                )}

                {emails.length > 0 && (
                  <DoctorInfo
                    label="Email"
                    value={emails.join(", ")}
                  />
                )}

                {doctor.contactInfo?.website && (
                  <DoctorInfo
                    label="Website"
                    value={doctor.contactInfo.website}
                  />
                )}

                {doctor.contactInfo?.facebook && (
                  <DoctorInfo
                    label="Facebook"
                    value={doctor.contactInfo.facebook}
                  />
                )}

                {doctor.contactInfo?.linkedin && (
                  <DoctorInfo
                    label="LinkedIn"
                    value={doctor.contactInfo.linkedin}
                  />
                )}
              </div>
            </Section>
          )} */}

          {/* Doctor notes */}
          {/* {doctor.notes && (
            <Section title="Notes">
              <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {doctor.notes}
              </div>
            </Section>
          )} */}
        </div>

        {/* Modal footer actions */}
        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-6">
          {/* Close without editing */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>

          {/* Open doctor in edit form */}
          <button
            type="button"
            onClick={handleEdit}
            className="btn-primary flex items-center gap-2"
          >
            <Pencil size={16} />
            Edit Doctor
          </button>
        </div>
      </div>
    </div>
  );
}
