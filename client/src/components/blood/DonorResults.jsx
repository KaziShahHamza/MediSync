// client/src/components/blood/DonorResults.jsx

// Renders donor search results after a search has been performed.
// Handles populated results and the no-match state.

import { Droplets } from "lucide-react";

import DonorResultItem from "./DonorResultItem";

export default function DonorResults({ donors, searched, loading, error }) {
  // Hide the result section until a completed search can be displayed.
  if (!searched || loading || error) {
    return null;
  }

  // Track the number of donors returned by the search.
  const donorCount = donors.length;

  return (
    <section>
      {/* Render the result heading and total matching donor count. */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="section-title text-xl">Available Donors</h2>

          <p className="text-sm text-muted mt-1">
            {donorCount} donor
            {donorCount !== 1 ? "s" : ""} found.
          </p>
        </div>
      </div>

      {/* Switch between matching donor results and the empty state. */}
      {donorCount > 0 ? (
        <div className="card overflow-hidden">
          <div className="hidden md:grid md:grid-cols-[1.2fr_1.5fr_1.5fr_1.2fr] gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200">
            <p className="small-label">Blood Group</p>

            <p className="small-label">District</p>

            <p className="small-label">Upazila</p>

            <p className="small-label text-right">Contact</p>
          </div>

          {/* Render each matching donor using the reusable item component. */}
          <div className="divide-y divide-slate-200">
            {donors.map((donor, index) => (
              <DonorResultItem
                key={`${donor.bloodGroup}-${donor.district}-${donor.upazila}-${index}`}
                donor={donor}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Droplets size={22} />
          </div>

          <h3 className="empty-state-title">No donors found</h3>

          <p className="empty-state-description">
            No available donors match your selected blood group, location, and
            compensation preference.
          </p>
        </div>
      )}
    </section>
  );
}
