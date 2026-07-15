export default function ProfileSelect({
  label,
  children,
  ...props
}) {
  return (
    <div>

      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>


      <select
        {...props}
        className="input w-full"
      >
        {children}
      </select>


    </div>
  );
}