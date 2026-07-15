export default function ProfileInput({
  label,
  ...props
}) {
  return (
    <div>

      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>

      <input
        {...props}
        className="input w-full"
      />

    </div>
  );
}