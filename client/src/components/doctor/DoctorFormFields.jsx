import { MousePointer2 } from "lucide-react";

function getOptionValue(option) {
  if (typeof option === "string" || typeof option === "number") {
    return String(option);
  }

  return String(
    option.value ??
      option.name ??
      option.label ??
      "",
  );
}

function getOptionLabel(option) {
  if (typeof option === "string" || typeof option === "number") {
    return String(option);
  }

  return String(
    option.label ??
      option.name ??
      option.value ??
      "",
  );
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <select
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className="input"
      >
        <option value="">{placeholder}</option>

        {options.map((option, index) => {
          const optionValue = getOptionValue(option);
          const optionLabel = getOptionLabel(option);

          if (!optionValue && !optionLabel) {
            return null;
          }

          return (
            <option
              key={`${optionValue}-${index}`}
              value={optionValue}
            >
              {optionLabel}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export function MultiSelect({
  label,
  options = [],
  value = [],
  onChange,
  placeholder = "Select options",
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        <select
          multiple
          value={value}
          onChange={onChange}
          className="input min-h-28 appearance-none pr-10"
        >
          {options.map((option, index) => {
            const optionValue = getOptionValue(option);
            const optionLabel = getOptionLabel(option);

            if (!optionValue && !optionLabel) {
              return null;
            }

            return (
              <option
                key={`${optionValue}-${index}`}
                value={optionValue}
              >
                {optionLabel}
              </option>
            );
          })}
        </select>

        <MousePointer2
          size={16}
          className="pointer-events-none absolute right-3 top-3 text-slate-400"
        />
      </div>

      <p className="mt-1.5 text-xs text-slate-400">
        {placeholder}. Hold Ctrl/Cmd to select multiple.
      </p>
    </div>
  );
}

export function TimeSelect({
  value,
  onChange,
}) {
  const hours = Array.from(
    { length: 12 },
    (_, index) => String(index + 1),
  );

  return (
    <select
      value={value}
      onChange={onChange}
      className="input"
      aria-label="Time"
    >
      {hours.map((hour) => (
        <option key={hour} value={hour}>
          {hour}
        </option>
      ))}
    </select>
  );
}

export function PeriodSelect({
  value,
  onChange,
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="input"
      aria-label="AM or PM"
    >
      <option value="AM">AM</option>
      <option value="PM">PM</option>
    </select>
  );
}