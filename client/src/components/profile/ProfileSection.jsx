// client/src/components/profile/ProfileSection.jsx

// Provides a reusable section container for profile content.

export default function ProfileSection({ title, description, children }) {
  // Renders the section heading followed by its supplied content.
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6">
      {/* Section heading and optional description */}
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>

        {description && (
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        )}
      </div>

      {children}
    </section>
  );
}
