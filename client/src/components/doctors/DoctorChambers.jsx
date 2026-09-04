// src/components/doctor/DoctorChambers.jsx

import { Plus, Trash2 } from "lucide-react";

import hospitals from "../../data/hospitals.json";
import days from "../../data/days.json";

export default function DoctorChambers({
  chambers,
  onChange,
  onAdd,
  onRemove,
}) {
  function updateChamber(index, field, value) {
    onChange(index, field, value);
  }

  function handleDaysChange(index, event) {
    const values = Array.from(
      event.target.selectedOptions,
      (option) => option.value,
    );

    updateChamber(index, "visitingDays", values);
  }

  return (
    <div className="ms-doctor-chambers">
      {chambers.map((chamber, index) => (
        <div key={index} className="ms-doctor-chamber">
          <div className="ms-doctor-chamber-header">
            <div>
              <span className="ms-doctor-chamber-number">
                Chamber {index + 1}
              </span>

              {/* <h4 className="ms-doctor-chamber-title">
                {chamber.name || "New chamber"}
              </h4> */}
            </div>

            {chambers.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="ms-btn ms-btn-icon ms-btn-danger ms-doctor-remove-button"
                aria-label={`Remove chamber ${index + 1}`}
              >
                <Trash2 size={17} aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="ms-stack-md">
            <div className="ms-field">
              <label htmlFor={`chamber-name-${index}`} className="ms-label-3">
                Chamber Name
              </label>

              <select
                id={`chamber-name-${index}`}
                value={chamber.name || ""}
                onChange={(e) => updateChamber(index, "name", e.target.value)}
                className="ms-select"
              >
                <option value="">Select Chamber / Hospital</option>

                {hospitals.map((hospital) => (
                  <option
                    key={`${hospital.name}-${hospital.city}`}
                    value={hospital.name}
                  >
                    {hospital.name} — {hospital.city}
                  </option>
                ))}
              </select>
            </div>

            <div className="ms-field">
              <label htmlFor={`chamber-address-${index}`} className="ms-label-3">
                Chamber Address
              </label>

              <textarea
                id={`chamber-address-${index}`}
                value={chamber.address || ""}
                onChange={(e) =>
                  updateChamber(index, "address", e.target.value)
                }
                placeholder="Full chamber address"
                className="ms-input ms-textarea"
                rows={3}
              />
            </div>

            <div className="ms-field">
              <label htmlFor={`chamber-phone-${index}`} className="ms-label-3">
                Chamber Phone
              </label>

              <input
                id={`chamber-phone-${index}`}
                type="tel"
                value={chamber.phone || ""}
                onChange={(e) => updateChamber(index, "phone", e.target.value)}
                placeholder="Chamber phone number"
                className="ms-input"
              />
            </div>

            <div className="ms-field">
              <label htmlFor={`chamber-days-${index}`} className="ms-label-3">
                Visiting Days
              </label>

              <select
                id={`chamber-days-${index}`}
                multiple
                value={chamber.visitingDays || []}
                onChange={(e) => handleDaysChange(index, e)}
                className="ms-select ms-select-multiple"
              >
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

              <p className="ms-help-text">
                Select all days the doctor visits this chamber.
              </p>
            </div>

            <div className="ms-field">
              <label htmlFor={`chamber-time-${index}`} className="ms-label-3">
                Visiting Time
              </label>

              <input
                id={`chamber-time-${index}`}
                type="text"
                value={chamber.visitingTime || ""}
                onChange={(e) =>
                  updateChamber(index, "visitingTime", e.target.value)
                }
                placeholder="Example: 6 PM - 9 PM"
                className="ms-input"
              />
            </div>
          </div>
        </div>
      ))}

      {chambers.length === 0 && (
        <div className="ms-empty-state">
          <p>No chambers added.</p>

          <button
            type="button"
            onClick={onAdd}
            className="ms-btn ms-btn-secondary"
          >
            <Plus size={16} aria-hidden="true" />
            Add chamber
          </button>
        </div>
      )}
    </div>
  );
}
