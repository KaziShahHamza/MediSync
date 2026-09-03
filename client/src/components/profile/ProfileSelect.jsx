// src/components/profile/ProfileSelect.jsx

export default function ProfileSelect({
  label,
  children,
  ...props
}) {
  const selectId =
    props.id ||
    (props.name ? `profile-${props.name}` : undefined);

  return (
    <div className="ms-field">
      <label
        className="ms-label"
        htmlFor={selectId}
      >
        {label}
      </label>

      <select
        {...props}
        id={selectId}
        className="ms-select"
      >
        {children}
      </select>
    </div>
  );
}