// client/src/components/medical-record/MedicalRecordCard.jsx

// Displays individual medical record cards with image preview and delete action.

import { Eye, Trash2, CalendarDays } from "lucide-react";

// Card component to display individual medical record overview
export default function MedicalRecordCard({ record, onOpen, onDelete }) {
  return (
    // Card container
    <div className="card overflow-hidden p-0">
      {/* Image thumbnail preview container with hover overlay */}
      <div
        className="relative h-52 bg-slate-100 cursor-pointer"
        onClick={() => onOpen(record)}
      >
        <img
          src={record.imageUrl}
          alt={record.title}
          className="w-full h-full object-cover"
        />

        {/* Hover preview eye overlay */}
        <div className="absolute inset-0 bg-slate-900/0 hover:bg-slate-900/20 transition duration-150 flex items-center justify-center">
          <Eye
            size={30}
            className="text-white opacity-0 hover:opacity-100 transition"
          />
        </div>
      </div>

      {/* Card details body */}
      <div className="p-5">
        <h3 className="font-semibold text-slate-900 truncate">
          {record.title}
        </h3>

        {/* Upload timestamp display */}
        <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
          <CalendarDays size={16} />

          <p>Uploaded:</p>

          {new Date(record.createdAt).toLocaleDateString()}
        </div>

        {/* Delete record trigger button */}
        <button
          type="button"
          onClick={() => onDelete(record._id)}
          className="mt-5 inline-flex items-center justify-center gap-2 w-full rounded-xl border border-red-200 text-red-600 py-2.5 font-medium transition duration-150 hover:bg-red-50"
        >
          <Trash2 size={17} />
          Delete
        </button>
      </div>
    </div>
  );
}
