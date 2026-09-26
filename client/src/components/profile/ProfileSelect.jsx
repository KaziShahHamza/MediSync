// client/src/components/profile/ProfileSelect.jsx

// Provides a reusable styled select field for profile forms.

export default function ProfileSelect({ label, id, children, ...props }) {
  // Uses the provided id or falls back to the select name for label association.
  const selectId = id || props.name;

  // Renders the labeled profile select with shared application styling.
  return (
    <div>
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-slate-700 mb-2"
      >
        {label}
      </label>

      <select {...props} id={selectId} className="input w-full">
        {children}
      </select>
    </div>
  );
}
