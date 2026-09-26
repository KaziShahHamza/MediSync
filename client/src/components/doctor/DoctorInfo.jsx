// client/src/components/doctor/DoctorInfo.jsx

// Displays a reusable icon, label, and value block for doctor details.
// Hides the block automatically when no value is available.

export default function DoctorInfo({ icon, label, value, className = "" }) {
  // Skip empty information blocks to keep the details view concise.
  if (!value) {
    return null;
  }

  // Build the information row with optional additional styling.
  const containerClassName = `flex gap-3 rounded-xl bg-slate-50 p-3 ${className}`;

  // Render the icon, label, and doctor information value.
  return (
    <div className={containerClassName}>
      <div className="mt-1 shrink-0 text-blue-600">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>

        <p className="mt-1 break-words font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}
