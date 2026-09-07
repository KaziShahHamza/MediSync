// client/src/components/DoctorInfo.jsx

export default function DoctorInfo({
  icon,
  label,
  value,
  className = "",
}) {
  if (!value) return null;

  return (
    <div className={`flex gap-3 rounded-xl bg-slate-50 p-3 ${className}`}>
      <div className="mt-1 shrink-0 text-blue-600">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>

        <p className="mt-1 break-words font-medium text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}