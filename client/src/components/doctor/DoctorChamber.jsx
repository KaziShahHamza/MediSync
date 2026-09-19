// client/src/components/doctor/DoctorChamber.jsx

import {
  Building2,
  Clock,
  CircleDollarSign,
  MapPin,
  Phone,
  Stethoscope,
} from "lucide-react";

export default function DoctorChamber({
  chamber,
  index = 0,
  compact = false,
}) {
  if (!chamber) return null;

  const visitingDays = chamber.visitingDays || [];
  const visitingTime = chamber.visitingTime || {};

  const hasVisitingTime =
    visitingTime.startHour &&
    visitingTime.startPeriod &&
    visitingTime.endHour &&
    visitingTime.endPeriod;

  const hasVisitFee =
    chamber.visitFee !== null &&
    chamber.visitFee !== undefined &&
    chamber.visitFee !== "";

  const formattedVisitFee = hasVisitFee
    ? Number(chamber.visitFee).toLocaleString("en-BD")
    : "";

  return (
    <div
      className={`rounded-xl bg-slate-50 ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <div className="flex items-start gap-3">
        <Building2
          size={18}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <div className="min-w-0">
          <p className="font-semibold text-slate-800">
            {chamber.name || `Chamber ${index + 1}`}
          </p>

          {chamber.district && (
            <p className="mt-0.5 text-sm text-slate-500">
              {chamber.district}
            </p>
          )}

          {chamber.address && (
            <div className="mt-2 flex gap-2 text-sm text-slate-600">
              <MapPin
                size={16}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <span className="break-words">{chamber.address}</span>
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

      {hasVisitFee && (
        <div className="mt-3 flex items-center gap-2 text-sm text-slate-700">
          <CircleDollarSign size={16} className="text-blue-600" />
          <span>
            Visit Fee: <strong>৳{formattedVisitFee}</strong>
          </span>
        </div>
      )}

      {(visitingDays.length > 0 || hasVisitingTime) && (
        <div className="mt-3 flex gap-2 text-sm text-slate-600">
          <Clock
            size={16}
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <span>
            {visitingDays.join(", ") || "-"}

            {hasVisitingTime &&
              ` • ${visitingTime.startHour} ${visitingTime.startPeriod} to ${visitingTime.endHour} ${visitingTime.endPeriod}`}
          </span>
        </div>
      )}

      {!compact && !chamber.name && !chamber.address && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Stethoscope size={16} />
          Chamber {index + 1}
        </div>
      )}
    </div>
  );
}