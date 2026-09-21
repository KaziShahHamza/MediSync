// client/src/components/medicine/MedicineTreatment.jsx

// Handles medicine treatment start, active status, and end-date inputs.

import { CalendarDays } from "lucide-react";

import { MEDICINE_MONTHS } from "../../data/medicine/medicineMonths";

// Renders options and form controls for medicine treatment duration.
export default function MedicineTreatment({
  startMonth,
  setStartMonth,
  startYear,
  setStartYear,
  endMonth,
  setEndMonth,
  endYear,
  setEndYear,
  isActive,
  setIsActive,
  yearOptions,
}) {
  // Updates start year and resets end date if end year precedes start year.
  const handleStartYearChange = (event) => {
    const value = event.target.value;

    setStartYear(value);

    if (endYear && value && Number(endYear) < Number(value)) {
      setEndMonth("");
      setEndYear("");
    }
  };

  return (
    <section className="space-y-4">
      {/* Treatment period section header */}
      <div>
        <div className="flex items-center gap-2">
          <CalendarDays size={18} className="text-sky-600" />

          <h3 className="text-sm font-semibold text-slate-900">
            Treatment period
          </h3>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          Set when the medicine treatment started and whether you are still
          taking it.
        </p>
      </div>

      {/* Start date dropdown selectors */}
      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">
          Treatment started
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <select
            value={startMonth}
            onChange={(event) => setStartMonth(event.target.value)}
            className="input w-full"
            aria-label="Treatment start month"
          >
            <option value="">Select month</option>

            {MEDICINE_MONTHS.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>

          <select
            value={startYear}
            onChange={handleStartYearChange}
            className="input w-full"
            aria-label="Treatment start year"
          >
            <option value="">Select year</option>

            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Checkbox for active treatment status */}
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => setIsActive(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
        />

        <div>
          <p className="text-sm font-medium text-slate-800">
            I am currently taking this medicine
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            Uncheck this when the treatment has been completed.
          </p>
        </div>
      </label>

      {/* Conditional end date dropdown selectors for finished treatment */}
      {!isActive && (
        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">
            Treatment ended
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <select
              value={endMonth}
              onChange={(event) => setEndMonth(event.target.value)}
              className="input w-full"
              aria-label="Treatment end month"
            >
              <option value="">Select month</option>

              {MEDICINE_MONTHS.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>

            <select
              value={endYear}
              onChange={(event) => setEndYear(event.target.value)}
              className="input w-full"
              aria-label="Treatment end year"
            >
              <option value="">Select year</option>

              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </section>
  );
}
