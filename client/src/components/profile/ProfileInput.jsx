// src/components/profile/ProfileInput.jsx

export default function ProfileInput({
  label,
  disabled = false,
  ...props
}) {
  const inputId =
    props.id ||
    (props.name ? `profile-${props.name}` : undefined);

  return (
    <div className="ms-field">
      <label
        className="ms-label"
        htmlFor={inputId}
      >
        {label}
      </label>

      <input
        {...props}
        id={inputId}
        disabled={disabled}
        className={`ms-input ${
          disabled ? "ms-input-disabled" : ""
        }`}
      />
    </div>
  );
}