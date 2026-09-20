// client/src/components/doctor/DoctorFormSection.jsx

// Provides a reusable section wrapper for organizing doctor form fields.

export default function DoctorFormSection({
  title,
  children,
  className = "",
}) {
  return (
    // Applies optional layout classes while rendering the section title.
    <section className={className}>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>

      {children}
    </section>
  );
}

