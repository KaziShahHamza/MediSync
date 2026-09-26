// client/src/components/medical-record/MedicalRecordCard.jsx

// Displays an individual medical record with image preview and metadata.
// Provides actions for opening and deleting the selected record.

import { CalendarDays, Eye, Trash2 } from "lucide-react";

// Renders a medical record card with preview and delete controls.
export default function MedicalRecordCard({ record, onOpen, onDelete }) {
  // Opens the record viewer when the image area is selected.
  const handleOpen = () => {
    onOpen(record);
  };

  // Requests deletion using the current record identifier.
  const handleDelete = () => {
    onDelete(record._id);
  };

  return (
    <div className="card overflow-hidden p-0">
      <div
        className="relative h-52 bg-slate-100 cursor-pointer"
        onClick={handleOpen}
      >
        <img
          src={record.imageUrl}
          alt={record.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-slate-900/0 hover:bg-slate-900/20 transition duration-150 flex items-center justify-center">
          <Eye
            size={30}
            className="text-white opacity-0 hover:opacity-100 transition"
          />
        </div>
      </div>

      {/* Displays the record title and upload date. */}
      <div className="p-5">
        <h3 className="font-semibold text-slate-900 truncate">
          {record.title}
        </h3>

        <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
          <CalendarDays size={16} />

          <p>Uploaded:</p>

          {new Date(record.createdAt).toLocaleDateString()}
        </div>

        <button
          type="button"
          onClick={handleDelete}
          className="mt-5 inline-flex items-center justify-center gap-2 w-full rounded-xl border border-red-200 text-red-600 py-2.5 font-medium transition duration-150 hover:bg-red-50"
        >
          <Trash2 size={17} />
          Delete
        </button>
      </div>
    </div>
  );
}
