// client/src/components/DoctorCard.jsx

import {
  Pencil,
  Trash2,
  Building2,
  Phone,
  Clock,
  Stethoscope,
  GraduationCap,
  BadgeCheck,
  MapPin,
  Hash,
  Mail,
  Globe,
} from "lucide-react";

export default function DoctorCard({ doctor, onEdit, onDelete }) {
  const specialities = doctor.specialities || [];
  const degrees = doctor.degrees || [];
  const chambers = doctor.chambers || [];

  const phones = doctor.contactInfo?.phones || [];
  const emails = doctor.contactInfo?.emails || [];

  return (
    <div className="card">
      {/* Header */}
      <div className="flex justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-xl font-semibold text-slate-900">
            {doctor.name}
          </h3>

          <p className="mt-1 text-blue-600 font-medium">
            {doctor.designation || "Doctor"}
          </p>
        </div>

        {specialities.length > 0 && (
          <div className="flex h-fit max-w-[50%] flex-wrap justify-end gap-2">
            {specialities.map((speciality) => (
              <span
                key={speciality}
                className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600 font-medium"
              >
                {speciality}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Professional Information */}
      {(degrees.length > 0 || doctor.bmdcRegNo || doctor.primaryHospital) && (
        <div className="mt-6 grid gap-4">
          {/* Degrees */}
          {degrees.length > 0 && (
            <Info
              icon={<GraduationCap size={18} />}
              label="Degrees"
              value={degrees.join(", ")}
            />
          )}

          {/* BMDC Registration */}
          {doctor.bmdcRegNo && (
            <Info
              icon={<BadgeCheck size={18} />}
              label="BMDC Registration"
              value={doctor.bmdcRegNo}
            />
          )}

          {/* Primary Hospital */}
          {doctor.primaryHospital && (
            <Info
              icon={<Building2 size={18} />}
              label="Primary Hospital"
              value={doctor.primaryHospital}
            />
          )}
        </div>
      )}

      {/* Chambers */}
      {chambers.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2">
            <Stethoscope size={18} className="text-blue-600" />

            <h4 className="font-semibold text-slate-800">
              Chambers
            </h4>
          </div>

          <div className="space-y-3">
            {chambers.map((chamber, index) => (
              <div
                key={chamber._id || index}
                className="rounded-xl bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {chamber.name || `Chamber ${index + 1}`}
                    </p>

                    {chamber.address && (
                      <div className="mt-2 flex gap-2 text-sm text-slate-600">
                        <MapPin
                          size={16}
                          className="mt-0.5 shrink-0 text-blue-600"
                        />

                        <span>{chamber.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {chamber.phone && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                    <Phone size={16} className="text-blue-600" />
                    <span>{chamber.phone}</span>
                  </div>
                )}

                {chamber.serialNumber && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                    <Hash size={16} className="text-blue-600" />
                    <span>
                      Serial: {chamber.serialNumber}
                    </span>
                  </div>
                )}

                {(chamber.visitingDays?.length > 0 ||
                  chamber.visitingTime) && (
                  <div className="mt-3 flex gap-2 text-sm text-slate-600">
                    <Clock
                      size={16}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <span>
                      {chamber.visitingDays?.join(", ") || "-"}
                      {chamber.visitingTime
                        ? ` • ${chamber.visitingTime}`
                        : ""}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Information */}
      {(phones.length > 0 ||
        emails.length > 0 ||
        doctor.contactInfo?.website) && (
        <div className="mt-6">
          <h4 className="mb-3 font-semibold text-slate-800">
            Contact Information
          </h4>

          <div className="space-y-2">
            {phones.map((phone) => (
              <div
                key={phone}
                className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm"
              >
                <Phone size={17} className="text-blue-600" />
                <span className="font-medium text-slate-700">
                  {phone}
                </span>
              </div>
            ))}

            {emails.map((email) => (
              <div
                key={email}
                className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm"
              >
                <Mail size={17} className="text-blue-600" />
                <span className="font-medium text-slate-700">
                  {email}
                </span>
              </div>
            ))}

            {doctor.contactInfo?.website && (
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm">
                <Globe size={17} className="text-blue-600" />

                <span className="font-medium text-slate-700 break-all">
                  {doctor.contactInfo.website}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Social Links */}
      {(doctor.contactInfo?.facebook ||
        doctor.contactInfo?.linkedin) && (
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {doctor.contactInfo.facebook && (
            <span className="rounded-lg bg-slate-100 px-3 py-2 text-slate-600">
              Facebook: {doctor.contactInfo.facebook}
            </span>
          )}

          {doctor.contactInfo.linkedin && (
            <span className="rounded-lg bg-slate-100 px-3 py-2 text-slate-600">
              LinkedIn: {doctor.contactInfo.linkedin}
            </span>
          )}
        </div>
      )}

      {/* Notes */}
      {doctor.notes && (
        <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          {doctor.notes}
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => onEdit(doctor)}
          className="btn-secondary flex-1 flex items-center justify-center gap-2"
        >
          <Pencil size={16} />
          Edit
        </button>

        <button
          onClick={() => onDelete(doctor._id)}
          className="btn-danger flex-1 flex items-center justify-center gap-2"
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
      <div className="mt-1 text-blue-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-500">
          {label}
        </p>

        <p className="mt-1 font-medium text-slate-800 break-words">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}