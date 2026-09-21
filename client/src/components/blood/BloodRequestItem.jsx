import { Clock, Droplets, Phone, Pencil, Trash2 } from "lucide-react";

import {
  formatExpiry,
  formatTimeAgo,
} from "../../utils/blood/bloodRequestHelpers";

import { getManagementToken } from "../../utils/blood/bloodRequestStorage";

export default function BloodRequestItem({ request, user, onEdit, onDelete }) {
  const savedToken = getManagementToken(request.id);

  const canManage = Boolean(savedToken) || Boolean(user && request.hasAccount);

  return (
    <div className="px-5 py-5 md:px-6">
      {/* ====================================================
          Desktop
      ==================================================== */}

      <div className="hidden lg:grid lg:grid-cols-[1fr_1fr_1.5fr_1.8fr_1fr_1fr] gap-4 items-center">
        {/* Blood */}

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <Droplets size={19} />
          </div>

          <div>
            <p className="text-lg font-bold text-slate-900">
              {request.bloodGroup}
            </p>

            <p className="text-xs text-slate-500">Blood group</p>
          </div>
        </div>

        {/* Bags */}

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

        {/* Location */}

        <div>
          <p className="text-sm font-medium text-slate-800">
            {request.district}
          </p>

          <p className="text-xs text-muted mt-1">{request.upazila}</p>
        </div>

        {/* Hospital */}

        <div>
          <p className="text-sm font-semibold text-slate-800">
            {request.hospital?.name}
          </p>

          <p className="text-xs text-muted mt-1 line-clamp-2">
            {request.hospital?.address}
          </p>
        </div>

        {/* Posted */}

        <div>
          <p className="text-xs text-slate-500">
            {formatTimeAgo(request.createdAt)}
          </p>

          <p className="text-xs text-slate-400 mt-1">
            {formatExpiry(request.expiresAt)}
          </p>
        </div>

        {/* Contact */}

        <div className="flex justify-end">
          <a href={`tel:${request.contactPhone}`} className="btn-primary">
            <Phone size={16} />
            Call
          </a>
        </div>
      </div>

      {/* ====================================================
          Mobile
      ==================================================== */}

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

        <a
          href={`tel:${request.contactPhone}`}
          className="btn-primary w-full mt-5"
        >
          <Phone size={17} />
          Call Requester
        </a>
      </div>

      {/* ====================================================
          Management
      ==================================================== */}

      {canManage && (
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onEdit(request)}
            className="btn-secondary h-10 px-4"
          >
            <Pencil size={15} />
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(request)}
            className="btn-danger h-10 px-4"
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
