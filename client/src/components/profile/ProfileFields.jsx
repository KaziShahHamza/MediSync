// client/src/components/profile/ProfileFields.jsx

// Provides reusable input, select, and section components for profile forms.
// Keeps profile-specific form presentation components together.

export function ProfileInput({
  label,
  id,
  className = "",
  disabled = false,
  ...props
}) {
  const inputId = id || props.name;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <input
        {...props}
        id={inputId}
        disabled={disabled}
        className={`input w-full ${
          disabled ? "!cursor-not-allowed !bg-gray-100 !text-slate-500" : ""
        } ${className}`}
      />
    </div>
  );
}

export function ProfileSelect({ label, id, children, ...props }) {
  const selectId = id || props.name;

  return (
    <div>
      <label
        htmlFor={selectId}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <select {...props} id={selectId} className="input w-full">
        {children}
      </select>
    </div>
  );
}

export function ProfileSection({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>

      {children}
    </section>
  );
}
