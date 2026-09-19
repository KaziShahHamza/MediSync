import { Plus, Trash2 } from "lucide-react";

import {
  chamberHospitals,
  getChamberHospitalValue,
} from "../../utils/doctor/doctorFormUtils";

import {
  addChamber,
  getSelectedChamberHospital,
  removeChamber,
  selectChamberHospital,
  updateChamber,
  updateVisitingTime,
} from "../../utils/doctor/doctorFunctions";

import {
  SelectField,
  TimeSelect,
  PeriodSelect,
} from "./DoctorFormFields";

export default function ChamberForm({
  form,
  setForm,
  days,
}) {
  function handleChamberChange(index, field, value) {
    setForm((previousForm) =>
      updateChamber(previousForm, index, field, value),
    );
  }

  function handleHospitalChange(index, value) {
    setForm((previousForm) =>
      selectChamberHospital(previousForm, index, value),
    );
  }

  function handleVisitingTimeChange(index, field, value) {
    setForm((previousForm) =>
      updateVisitingTime(
        previousForm,
        index,
        field,
        value,
      ),
    );
  }

  function handleAddChamber() {
    setForm((previousForm) => addChamber(previousForm));
  }

  function handleRemoveChamber(index) {
    setForm((previousForm) =>
      removeChamber(previousForm, index),
    );
  }

  return (
    <div className="space-y-4">
      {form.chambers.map((chamber, index) => {
        const selectedHospital =
          getSelectedChamberHospital(chamber);

        return (
          <div
            key={`chamber-${index}`}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-800">
                Chamber {index + 1}
              </h4>

              {form.chambers.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveChamber(index)
                  }
                  className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                  aria-label={`Remove chamber ${index + 1}`}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Chamber / Hospital
                </label>

                <select
                  value={
                    selectedHospital
                      ? getChamberHospitalValue(
                          selectedHospital,
                        )
                      : ""
                  }
                  onChange={(event) =>
                    handleHospitalChange(
                      index,
                      event.target.value,
                    )
                  }
                  className="input"
                >
                  <option value="">
                    Select chamber / hospital
                  </option>

                  {chamberHospitals.map((hospital) => (
                    <option
                      key={hospital.key}
                      value={getChamberHospitalValue(
                        hospital,
                      )}
                    >
                      {hospital.name} — {hospital.district}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Chamber Name
                </label>

                <input
                  type="text"
                  value={chamber.name}
                  onChange={(event) =>
                    handleChamberChange(
                      index,
                      "name",
                      event.target.value,
                    )
                  }
                  placeholder="Chamber name"
                  className="input"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  District
                </label>

                <input
                  type="text"
                  value={chamber.district}
                  onChange={(event) =>
                    handleChamberChange(
                      index,
                      "district",
                      event.target.value,
                    )
                  }
                  placeholder="District"
                  className="input"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Address
                </label>

                <textarea
                  value={chamber.address}
                  onChange={(event) =>
                    handleChamberChange(
                      index,
                      "address",
                      event.target.value,
                    )
                  }
                  rows={2}
                  placeholder="Full chamber address"
                  className="input resize-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Phone
                  </label>

                  <input
                    type="tel"
                    value={chamber.phone}
                    onChange={(event) =>
                      handleChamberChange(
                        index,
                        "phone",
                        event.target.value,
                      )
                    }
                    placeholder="01XXXXXXXXX"
                    className="input"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Serial Number
                  </label>

                  <input
                    type="text"
                    value={chamber.serialNumber}
                    onChange={(event) =>
                      handleChamberChange(
                        index,
                        "serialNumber",
                        event.target.value,
                      )
                    }
                    placeholder="e.g. 101"
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Visit Fee
                </label>

                <input
                  type="number"
                  min="0"
                  value={chamber.visitFee}
                  onChange={(event) =>
                    handleChamberChange(
                      index,
                      "visitFee",
                      event.target.value,
                    )
                  }
                  placeholder="e.g. 1000"
                  className="input"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Visiting Days
                </label>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {days.map((day) => {
                    const checked =
                      chamber.visitingDays.includes(day);

                    return (
                      <label
                        key={day}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                          checked
                            ? "border-blue-300 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(event) => {
                            const nextDays =
                              event.target.checked
                                ? [
                                    ...chamber.visitingDays,
                                    day,
                                  ]
                                : chamber.visitingDays.filter(
                                    (item) =>
                                      item !== day,
                                  );

                            handleChamberChange(
                              index,
                              "visitingDays",
                              nextDays,
                            );
                          }}
                          className="accent-blue-600"
                        />

                        <span>{day}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Visiting Time
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <TimeSelect
                    value={
                      chamber.visitingTime?.startHour ||
                      "6"
                    }
                    onChange={(event) =>
                      handleVisitingTimeChange(
                        index,
                        "startHour",
                        event.target.value,
                      )
                    }
                  />

                  <PeriodSelect
                    value={
                      chamber.visitingTime?.startPeriod ||
                      "PM"
                    }
                    onChange={(event) =>
                      handleVisitingTimeChange(
                        index,
                        "startPeriod",
                        event.target.value,
                      )
                    }
                  />

                  <TimeSelect
                    value={
                      chamber.visitingTime?.endHour ||
                      "9"
                    }
                    onChange={(event) =>
                      handleVisitingTimeChange(
                        index,
                        "endHour",
                        event.target.value,
                      )
                    }
                  />

                  <PeriodSelect
                    value={
                      chamber.visitingTime?.endPeriod ||
                      "PM"
                    }
                    onChange={(event) =>
                      handleVisitingTimeChange(
                        index,
                        "endPeriod",
                        event.target.value,
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={handleAddChamber}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-blue-300 px-4 py-3 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
      >
        <Plus size={17} />
        Add Another Chamber
      </button>
    </div>
  );
}