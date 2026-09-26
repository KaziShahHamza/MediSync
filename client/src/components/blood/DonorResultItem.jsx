// client/src/components/blood/DonorResultItem.jsx

// Renders an individual donor result with responsive layouts.
// Provides donor location details and direct contact access.

import { Droplets, MapPin, Phone } from "lucide-react";

export default function DonorResultItem({ donor }) {
  // Build the donor's direct phone contact destination.
  const phoneHref = `tel:${donor.bloodDonationContactNumber}`;

  return (
    <div className="px-5 py-5 md:px-6">
      {/* Render the structured donor row on medium and larger screens. */}
      <div className="hidden md:grid md:grid-cols-[1.2fr_1.5fr_1.5fr_1.2fr] gap-4 items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Droplets size={19} />
          </div>

          <span className="text-lg font-bold text-slate-900">
            {donor.bloodGroup}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={17} className="text-slate-400 shrink-0" />

          <span className="text-sm font-medium text-slate-800">
            {donor.district}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={17} className="text-slate-400 shrink-0" />

          <span className="text-sm font-medium text-slate-800">
            {donor.upazila}
          </span>
        </div>

        {/* Provide direct phone contact for desktop users. */}
        <div className="flex justify-end">
          <a href={phoneHref} className="btn-primary">
            <Phone size={16} />
            Contact
          </a>
        </div>
      </div>

      {/* Render a stacked donor card on small screens. */}
      <div className="md:hidden">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Droplets size={20} />
          </div>

          <div>
            <p className="text-xs text-slate-500">Blood Group</p>

            <p className="text-xl font-bold text-slate-900">
              {donor.bloodGroup}
            </p>
          </div>
        </div>

        {/* Display the donor's location details for mobile users. */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500">District</p>

            <p className="text-sm font-medium text-slate-800 mt-1">
              {donor.district}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Upazila</p>

            <p className="text-sm font-medium text-slate-800 mt-1">
              {donor.upazila}
            </p>
          </div>
        </div>

        {/* Provide a full-width contact action on mobile. */}
        <a href={phoneHref} className="btn-primary w-full mt-5">
          <Phone size={17} />
          Contact Donor
        </a>
      </div>
    </div>
  );
}
