// client/src/components/doctor/ChamberItem.jsx

// Renders and manages the fields for one doctor chamber.
// Handles hospital, contact, fee, visiting-day, and visiting-time inputs.

import { Trash2 } from "lucide-react";

import {
  chamberHospitals,
  getChamberHospitalValue,
} from "../../utils/doctor/doctorFormUtils";

import { getSelectedChamberHospital } from "../../utils/doctor/doctorFunctions";

import { TimeSelect, PeriodSelect } from "./DoctorFormFields";

export default function ChamberItem({
  chamber,
  index,
  total,
  days,
  onChange,
  onHospitalChange,
  onTimeChange,
  onRemove,
}) {
  // Finds the predefined hospital matching the chamber data.
  const selectedHospital = getSelectedChamberHospital(chamber);

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      {/* Displays the chamber title and remove action. */}
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-800">
          Chamber {index + 1}
        </h4>

        {total > 1 && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
            aria-label={`Remove chamber ${index + 1}`}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="space-y-4 grid gap-4 lg:grid-cols-2">
        {/* Selects a predefined chamber or hospital. */}
        <div>
          <label>Chamber / Hospital</label>

          <select
            value={
              selectedHospital ? getChamberHospitalValue(selectedHospital) : ""
            }
            onChange={(event) => onHospitalChange(index, event.target.value)}
            className="input"
          >
            <option value="">Select chamber / hospital</option>

            {chamberHospitals.map((hospital) => (
              <option
                key={hospital.key}
                value={getChamberHospitalValue(hospital)}
              >
                {hospital.name} — {hospital.district}
              </option>
            ))}
          </select>
        </div>

        {/* <Field
          label="Chamber Name"
          value={chamber.name}
          onChange={(value) =>
            onChange(index, "name", value)
          }
          placeholder="Chamber name"
        />

        <Field
          label="District"
          value={chamber.district}
          onChange={(value) =>
            onChange(index, "district", value)
          }
          placeholder="District"
        /> */}

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Captures the chamber phone number. */}
          <Field
            label="Phone"
            value={chamber.phone}
            onChange={(value) => onChange(index, "phone", value)}
            placeholder="01XXXXXXXXX"
            type="tel"
          />

          {/* <Field
            label="Serial Number"
            value={chamber.serialNumber}
            onChange={(value) =>
              onChange(index, "serialNumber", value)
            }
            placeholder="e.g. 101"
          /> */}

          {/* Captures the doctor's visit fee. */}
          <Field
            label="Visit Fee"
            value={chamber.visitFee}
            onChange={(value) => onChange(index, "visitFee", value)}
            placeholder="e.g. 1000"
            type="number"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 ">
        {/* Captures the full chamber address. */}
        <div>
          <label>Address</label>

          <textarea
            value={chamber.address}
            onChange={(event) => onChange(index, "address", event.target.value)}
            rows={2}
            placeholder="Full chamber address"
            className="input resize-none"
          />
        </div>

        {/* Allows the user to select available visiting days. */}
        <div>
          <label>Visiting Days</label>

          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-2">
            {days.map((day) => {
              const checked = chamber.visitingDays.includes(day);

              return (
                <label
                  key={day}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                    checked
                      ? "border-blue-300 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => {
                      // Adds or removes the selected visiting day.
                      const nextDays = event.target.checked
                        ? [...chamber.visitingDays, day]
                        : chamber.visitingDays.filter((item) => item !== day);

                      onChange(index, "visitingDays", nextDays);
                    }}
                    className="accent-blue-600"
                  />

                  {day}
                </label>
              );
            })}
          </div>
        </div>

        {/* Provides start and end visiting-time selectors. */}
        <div>
          <label>Visiting Time</label>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <TimeSelect
              value={chamber.visitingTime?.startHour || "6"}
              onChange={(event) =>
                onTimeChange(index, "startHour", event.target.value)
              }
            />

            <PeriodSelect
              value={chamber.visitingTime?.startPeriod || "PM"}
              onChange={(event) =>
                onTimeChange(index, "startPeriod", event.target.value)
              }
            />

            <TimeSelect
              value={chamber.visitingTime?.endHour || "9"}
              onChange={(event) =>
                onTimeChange(index, "endHour", event.target.value)
              }
            />

            <PeriodSelect
              value={chamber.visitingTime?.endPeriod || "PM"}
              onChange={(event) =>
                onTimeChange(index, "endPeriod", event.target.value)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Provides a reusable labeled input for chamber fields.
function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label>{label}</label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="input"
      />
    </div>
  );
}


