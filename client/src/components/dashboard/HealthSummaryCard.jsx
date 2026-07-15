export default function HealthSummaryCard({
  title,
  value,
  subtitle,
}) {
  return (
    <div className="card p-5">

      <h3 className="text-lg font-semibold text-slate-700">
        {title}
      </h3>

      <p className="text-3xl font-bold text-sky-600 mt-3">
        {value || "No data"}
      </p>

      {subtitle && (
        <p className="text-sm text-slate-500 mt-2">
          {subtitle}
        </p>
      )}

    </div>
  );
}