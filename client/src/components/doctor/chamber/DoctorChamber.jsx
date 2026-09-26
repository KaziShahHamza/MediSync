// client/src/components/doctor/DoctorChamber.jsx

// Displays a doctor's chamber location, contact, fee, days, and visiting time.
// Supports compact and standard display modes for different dashboard layouts.

import {
  Building2,
  CircleDollarSign,
  Clock,
  MapPin,
  Phone,
  Stethoscope,
} from "lucide-react";

import { formatVisitFee } from "../../../utils/doctor/doctorFunctions";

export default function DoctorChamber({ chamber, index = 0, compact = false }) {
  // Avoid rendering when chamber data is unavailable.
  if (!chamber) {
    return null;
  }

  // Normalize optional chamber collections before rendering.
  const visitingDays = chamber.visitingDays || [];
  const visitingTime = chamber.visitingTime || {};

  // Show visiting time only when all required fields are available.
  const hasVisitingTime =
    visitingTime.startHour &&
    visitingTime.startPeriod &&
    visitingTime.endHour &&
    visitingTime.endPeriod;

  // Determine whether a visit fee has been provided.
  const hasVisitFee =
    chamber.visitFee !== null &&
    chamber.visitFee !== undefined &&
    chamber.visitFee !== "";

  // Render the chamber details using the selected display size.
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-slate-50 ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0 rounded-lg bg-white p-2 text-blue-600 shadow-sm">
          <Building2 size={compact ? 16 : 18} />
        </div>

        <div className="min-w-0 flex-1">
          <h4
            className={`font-semibold text-slate-800 ${
              compact ? "text-sm" : "text-base"
            }`}
          >
            {chamber.name || `Chamber ${index + 1}`}
          </h4>

          {chamber.district && (
            <p className="mt-0.5 text-xs text-slate-500">{chamber.district}</p>
          )}
        </div>
      </div>

      <div className={`mt-3 space-y-2 ${compact ? "text-xs" : "text-sm"}`}>
        {chamber.address && (
          <div className="flex items-start gap-2 text-slate-600">
            <MapPin
              size={compact ? 14 : 16}
              className="mt-0.5 shrink-0 text-slate-400"
            />

            <span>{chamber.address}</span>
          </div>
        )}

        {chamber.phone && (
          <div className="flex items-center gap-2 text-slate-600">
            <Phone
              size={compact ? 14 : 16}
              className="shrink-0 text-slate-400"
            />

            <span>{chamber.phone}</span>
          </div>
        )}

        {chamber.serialNumber && (
          <div className="flex items-center gap-2 text-slate-600">
            <Stethoscope
              size={compact ? 14 : 16}
              className="shrink-0 text-slate-400"
            />

            <span>Serial: {chamber.serialNumber}</span>
          </div>
        )}

        {hasVisitFee && (
          <div className="flex items-center gap-2 text-slate-600">
            <CircleDollarSign
              size={compact ? 14 : 16}
              className="shrink-0 text-slate-400"
            />

            <span>
              Visit fee:{" "}
              <strong className="font-medium text-slate-700">
                ৳{formatVisitFee(chamber.visitFee)}
              </strong>
            </span>
          </div>
        )}

        {visitingDays.length > 0 && (
          <div className="flex items-start gap-2 text-slate-600">
            <Clock
              size={compact ? 14 : 16}
              className="mt-0.5 shrink-0 text-slate-400"
            />

            <div>
              <span>{visitingDays.join(", ")}</span>

              {hasVisitingTime && (
                <span className="ml-1">
                  · {visitingTime.startHour} {visitingTime.startPeriod} –{" "}
                  {visitingTime.endHour} {visitingTime.endPeriod}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {!chamber.address &&
        !chamber.phone &&
        !chamber.serialNumber &&
        !hasVisitFee &&
        visitingDays.length === 0 && (
          <p className="mt-3 text-xs text-slate-400">
            No additional chamber information available.
          </p>
        )}
    </div>
  );
}
