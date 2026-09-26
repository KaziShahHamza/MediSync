// client/src/components/doctor/DoctorFormSection.jsx

// Provides a reusable section wrapper for doctor form fields.
// Supports optional layout classes for responsive form placement.

export default function DoctorFormSection({ title, children, className = "" }) {
  // Combine caller-provided layout classes with the section element.
  const sectionClassName = className;

  // Render the section heading and its child form content.
  return (
    <section className={sectionClassName}>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>

      {children}
    </section>
  );
}
