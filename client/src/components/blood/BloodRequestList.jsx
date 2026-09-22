// client/src/components/blood/BloodRequestList.jsx

// Container component for managing and rendering active blood requests.
// Handles UI rendering states including loading indicators, request lists, and empty state fallbacks.
// Renders responsive list headers and delegates item rendering to individual components.

import { Droplets } from "lucide-react";

import BloodRequestItem from "./BloodRequestItem";

// Render collection of active blood requests or fallback screens
export default function BloodRequestList({
  requests,
  loading,
  onEdit,
  onDelete,
  user,
  onCreate,
}) {
  return (
    <section className="mb-10">
      {/* Header section with title and description */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Blood Requests</h2>

          <p className="text-sm text-muted mt-1">
            Active requests from people who currently need blood.
          </p>
        </div>
      </div>

      {/* Handle loading state, request collection list, or empty state */}
      {loading ? (
        /* Loading placeholder UI */
        <div className="card p-8 text-center">
          <p className="text-sm text-muted">Loading blood requests...</p>
        </div>
      ) : requests.length > 0 ? (
        /* Main table container */
        <div className="table-container">
          {/* Table header row visible on large screens */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_1fr_1.5fr_1.8fr_1fr_1fr] gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200">
            <p className="small-label">Blood</p>

            <p className="small-label">Bags</p>

            <p className="small-label">Location</p>

            <p className="small-label">Hospital</p>

            <p className="small-label">Posted</p>

            <p className="small-label text-right">Contact</p>
          </div>

          {/* List of blood request items */}
          <div className="divide-y divide-slate-200">
            {/* Map over requests array */}
            {requests.map((request) => (
              <BloodRequestItem
                key={request.id}
                request={request}
                user={user}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Empty state view displayed when no active requests exist */
        <div className="empty-state">
          <div className="empty-state-icon">
            <Droplets size={25} />
          </div>

          <h3 className="empty-state-title">No active blood requests</h3>

          <p className="empty-state-description">
            If someone needs blood, you can post a request and let donors know.
          </p>

          {/* Create new request CTA button */}
          <div className="empty-state-actions">
            <button type="button" onClick={onCreate} className="btn-primary">
              Post Blood Request
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
