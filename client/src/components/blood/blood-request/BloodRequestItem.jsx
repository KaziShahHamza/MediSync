// client/src/components/blood/BloodRequestItem.jsx

// Renders an individual blood request with responsive desktop and mobile layouts.
// Highlights requests the current user can manage and provides responsive
// contact, edit, and delete actions.

import { Clock, Droplets, Phone, Pencil, Trash2 } from "lucide-react";

import {
  formatExpiry,
  formatTimeAgo,
} from "../../../utils/blood/bloodRequestHelpers";

import { getManagementToken } from "../../../utils/blood/bloodRequestStorage";

export default function BloodRequestItem({ request, user, onEdit, onDelete }) {
  const isOwner = Boolean(user && request.isOwner);
  const hasVerifiedManagementToken = Boolean(
    !user && getManagementToken(request.id),
  );

  const canManage = isOwner || hasVerifiedManagementToken;

  const managementActionClass =
    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-opacity hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 lg:opacity-0 lg:pointer-events-none lg:group-hover:opacity-100 lg:group-hover:pointer-events-auto lg:group-focus-within:opacity-100 lg:group-focus-within:pointer-events-auto";

  return (
    <div
      className={`group px-5 py-5 md:px-6 ${
        canManage ? "border-l-4 border-blue-500 bg-blue-50" : ""
      }`}
    >
      {/* Desktop request layout. */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_1fr_1.5fr_1.8fr_1fr_1fr] gap-4 items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <Droplets size={19} />
          </div>

          <div>
            <p className="text-lg font-bold text-slate-900">
              {request.bloodGroup}
            </p>

            <p className="text-xs text-slate-500">Blood group</p>

            {canManage && (
              <span className="text-xs mt-1 p-1.5 rounded-2xl bg-gray-400/50 text-gray-800">
                My request
              </span>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-800">
            {request.bagsNeeded} bag
            {request.bagsNeeded !== 1 ? "s" : ""}
          </p>

          <span
            className={`badge mt-1 ${
              request.compensationOffered ? "badge-success" : ""
            }`}
          >
            {request.compensationOffered
              ? "Travel cost offered"
              : "No compensation"}
          </span>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-800">
            {request.district}
          </p>

          <p className="text-xs text-muted mt-1">{request.upazila}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-800">
            {request.hospital?.name}
          </p>

          <p className="text-xs text-muted mt-1 line-clamp-2">
            {request.hospital?.address}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">
            {formatTimeAgo(request.createdAt)}
          </p>

          <p className="text-xs text-slate-400 mt-1">
            {formatExpiry(request.expiresAt)}
          </p>
        </div>

        {/* Contact and management actions stay on the same line. */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit(request)}
            className={managementActionClass}
            aria-label="Edit blood request"
            title="Edit request"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(request)}
            className={`${managementActionClass} hover:border-red-200 hover:bg-red-50 hover:text-red-600`}
            aria-label="Delete blood request"
            title="Delete request"
          >
            <Trash2 size={16} />
          </button>

          <a href={`tel:${request.contactPhone}`} className="btn-primary">
            <Phone size={16} />
            Call
          </a>
        </div>
      </div>

      {/* Mobile request layout. */}
      <div className="lg:hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <Droplets size={20} />
            </div>

            <div>
              <p className="text-xl font-bold text-slate-900">
                {request.bloodGroup}
              </p>

              <p className="text-xs text-slate-500">
                {request.bagsNeeded} bag
                {request.bagsNeeded !== 1 ? "s" : ""}
              </p>

              {canManage && (
                <span className="text-xs mt-1 p-1.5 rounded-2xl bg-gray-400/50 text-gray-800">
                  My request
                </span>
              )}
            </div>
          </div>

          <span className="text-xs text-slate-400">
            {formatTimeAgo(request.createdAt)}
          </span>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <p className="small-label">Location</p>

            <p className="text-sm font-medium text-slate-800 mt-1">
              {request.district}
              {" • "}
              {request.upazila}
            </p>
          </div>

          <div>
            <p className="small-label">Hospital</p>

            <p className="text-sm font-semibold text-slate-800 mt-1">
              {request.hospital?.name}
            </p>

            <p className="text-xs text-muted mt-1">
              {request.hospital?.address}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`badge ${
                request.compensationOffered ? "badge-success" : ""
              }`}
            >
              {request.compensationOffered
                ? "Travel cost offered"
                : "No compensation"}
            </span>

            <span className="badge">
              <Clock size={13} />
              {formatExpiry(request.expiresAt)}
            </span>
          </div>
        </div>

        {/* Contact and management actions stay on the same line on mobile. */}
        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(request)}
            className={managementActionClass}
            aria-label="Edit blood request"
            title="Edit request"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(request)}
            className={`${managementActionClass} hover:border-red-200 hover:bg-red-50 hover:text-red-600`}
            aria-label="Delete blood request"
            title="Delete request"
          >
            <Trash2 size={16} />
          </button>

          <a
            href={`tel:${request.contactPhone}`}
            className="btn-primary flex-1"
          >
            <Phone size={17} />
            Call Requester
          </a>
        </div>
      </div>
    </div>
  );
}
