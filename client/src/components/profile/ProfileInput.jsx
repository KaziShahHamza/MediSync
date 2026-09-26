// client/src/components/profile/ProfileInput.jsx

// Provides a reusable styled input field for profile forms.

export default function ProfileInput({
  label,
  id,
  className = "",
  disabled = false,
  ...props
}) {
  // Uses the provided id or falls back to the input name for label association.
  const inputId = id || props.name;

  // Renders the labeled profile input with shared application styling.
  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-slate-700 mb-2"
      >
        {label}
      </label>

      <input
        {...props}
        id={inputId}
        disabled={disabled}
        className={`input w-full ${
          disabled ? "!bg-gray-100 !text-slate-500 cursor-not-allowed" : ""
        } ${className}`}
      />
    </div>
  );
}
