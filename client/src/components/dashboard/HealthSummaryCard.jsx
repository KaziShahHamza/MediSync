export default function HealthSummaryCard({
  title,
  value,
  subtitle,
  summary,
}) {
  return (
    <div className="card p-5">

      {summary ? (
        <>
          <h3 className="text-xl font-semibold text-slate-800 mb-3">
            Health Summary
          </h3>

          <p className="text-slate-600 leading-relaxed">
            {summary}
          </p>

          <p className="text-xs text-slate-400 mt-4">
            Based on your latest health records
          </p>
        </>
      ) : (
        <>
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
        </>
      )}

    </div>
  );
}