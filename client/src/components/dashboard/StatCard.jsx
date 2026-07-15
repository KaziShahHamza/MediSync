export default function StatCard({
  title,
  count,
  linkText,
  onClick,
}) {
  return (
    <div className="card p-5">

      <h3 className="text-lg font-semibold text-slate-700">
        {title}
      </h3>


      <p className="text-4xl font-bold text-sky-600 mt-3">
        {count}
      </p>


      <button
        onClick={onClick}
        className="mt-4 text-sky-600 hover:underline"
      >
        {linkText || "View"}
      </button>

    </div>
  );
}