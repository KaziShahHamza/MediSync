import { X, Pencil, GraduationCap, BadgeCheck, Building2 } from "lucide-react";
import DoctorInfo from "./DoctorInfo";
import DoctorChamber from "./DoctorChamber";

export default function DoctorModal({ doctor, onClose, onEdit }) {
  if (!doctor) return null;

  const degrees = doctor.degrees || [];
  const specialities = doctor.specialities || [];
  const chambers = doctor.chambers || [];
  const phones = doctor.contactInfo?.phones || [];
  const emails = doctor.contactInfo?.emails || [];

  const hasContactInfo =
    phones.length > 0 || emails.length > 0 || doctor.contactInfo?.website;

  const handleEdit = () => {
    onClose();
    onEdit(doctor);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white p-5">
          <div className="min-w-0">
            <h2 className="text-2xl font-semibold text-slate-900">
              {doctor.name}
            </h2>

            <p className="mt-1 font-medium text-blue-600">
              {doctor.designation || "Doctor"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-5">
          {/* Specialities */}
          {specialities.length > 0 && (
            <Section title="Specialities">
              <div className="flex flex-wrap gap-2">
                {specialities.map((speciality) => (
                  <span
                    key={speciality}
                    className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600"
                  >
                    {speciality}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Professional Information */}
          {(degrees.length > 0 ||
            doctor.bmdcRegNo ||
            doctor.primaryHospital) && (
            <Section title="Professional Information">
              <div className="grid gap-3 sm:grid-cols-2">
                {degrees.length > 0 && (
                  <DoctorInfo
                    icon={<GraduationCap size={18} />}
                    label="Degrees"
                    value={degrees.join(", ")}
                  />
                )}

                {doctor.bmdcRegNo && (
                  <DoctorInfo
                    icon={<BadgeCheck size={18} />}
                    label="BMDC Registration"
                    value={doctor.bmdcRegNo}
                  />
                )}

                {doctor.primaryHospital && (
                  <DoctorInfo
                    icon={<Building2 size={18} />}
                    label="Primary Hospital"
                    value={doctor.primaryHospital}
                    className="sm:col-span-2"
                  />
                )}
              </div>
            </Section>
          )}

          {/* Chambers */}
          {chambers.length > 0 && (
            <Section title="Chambers">
              <div className="space-y-3">
                {chambers.map((chamber, index) => (
                  <DoctorChamber
                    key={chamber._id || index}
                    chamber={chamber}
                    index={index}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Contact Information */}
          {hasContactInfo && (
            <Section title="Contact Information">
              <div className="space-y-3">
                {phones.map((phone) => (
                  <DoctorInfo key={phone} label="Phone" value={phone} />
                ))}

                {emails.map((email) => (
                  <DoctorInfo key={email} label="Email" value={email} />
                ))}

                {doctor.contactInfo?.website && (
                  <DoctorInfo
                    label="Website"
                    value={doctor.contactInfo.website}
                  />
                )}
              </div>
            </Section>
          )}

          {/* Notes */}
          {doctor.notes && (
            <Section title="Notes">
              <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                {doctor.notes}
              </div>
            </Section>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 flex gap-3 border-t border-slate-100 bg-white p-5">
          <button
            type="button"
            onClick={handleEdit}
            className="btn-primary flex flex-1 items-center justify-center gap-2"
          >
            <Pencil size={16} />
            Edit Doctor
          </button>

          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h3 className="mb-3 font-semibold text-slate-800">{title}</h3>

      {children}
    </section>
  );
}
