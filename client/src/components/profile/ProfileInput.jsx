// client/src/components/profile/ProfileInput.jsx

export default function ProfileInput({
  label,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>

      <input
        {...props}
        disabled={disabled}
        className={`input w-full ${
          disabled
            ? "!bg-gray-100 !text-slate-500 cursor-not-allowed"
            : ""
        } ${className}`}
      />
    </div>
  );
}