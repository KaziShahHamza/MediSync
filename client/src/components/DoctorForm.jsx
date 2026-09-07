import { MousePointer2, Plus, Trash2 } from "lucide-react";
import hospitals from "../data/hospitals.json";
import specialties from "../data/specialties.json";
import designations from "../data/designations.json";
import days from "../data/days.json";
import degrees from "../data/degrees.json";

export const emptyChamber = {
  name: "",
  address: "",
  phone: "",
  serialNumber: "",
  visitingDays: [],
  visitingTime: {
    startHour: "6",
    startPeriod: "PM",
    endHour: "9",
    endPeriod: "PM",
  },
};

export const emptyForm = {
  name: "",
  bmdcRegNo: "",
  degrees: [],
  specialities: [],
  designation: "",
  primaryHospital: "",
  chambers: [{ ...emptyChamber }],
  contactInfo: {
    phones: [],
    emails: [],
    website: "",
    facebook: "",
    linkedin: "",
  },
  notes: "",
};

export default function DoctorForm({
  form,
  editingId,
  onChange,
  onSubmit,
  onReset,
  setForm,
}) {
  function updateContact(type, index, value) {
    setForm((prev) => {
      const values = [...prev.contactInfo[type]];
      values[index] = value;

      return {
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [type]: values,
        },
      };
    });
  }

  function addContact(type) {
    setForm((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [type]: [...prev.contactInfo[type], ""],
      },
    }));
  }

  function removeContact(type, index) {
    setForm((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [type]: prev.contactInfo[type].filter((_, i) => i !== index),
      },
    }));
  }

  function updateChamber(index, field, value) {
    setForm((prev) => {
      const chambers = [...prev.chambers];

      chambers[index] = {
        ...chambers[index],
        [field]: value,
      };

      return { ...prev, chambers };
    });
  }

  function updateVisitingTime(index, field, value) {
    setForm((prev) => {
      const chambers = [...prev.chambers];

      chambers[index] = {
        ...chambers[index],
        visitingTime: {
          ...chambers[index].visitingTime,
          [field]: value,
        },
      };

      return { ...prev, chambers };
    });
  }

  function addChamber() {
    setForm((prev) => ({
      ...prev,
      chambers: [
        ...prev.chambers,
        {
          ...emptyChamber,
          visitingDays: [],
          visitingTime: { ...emptyChamber.visitingTime },
        },
      ],
    }));
  }

  function removeChamber(index) {
    if (form.chambers.length === 1) return;

    setForm((prev) => ({
      ...prev,
      chambers: prev.chambers.filter((_, i) => i !== index),
    }));
  }

  function updateMultiSelect(field, event) {
    const values = Array.from(
      event.target.selectedOptions,
      (option) => option.value,
    );

    setForm((prev) => ({
      ...prev,
      [field]: values,
    }));
  }

  return (
    <aside className="card sticky top-24">
      <div className="mb-6">
        <h2 className="card-title">
          {editingId ? "Update Doctor" : "Add Doctor"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Store professional, chamber, and contact details.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Basic + Professional Information */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Doctor Name */}
          <div>
            <label>Doctor Name</label>

            <input
              name="name"
              placeholder="Enter doctor name"
              value={form.name}
              onChange={onChange}
              className="input"
              required
            />
          </div>

          {/* BMDC Registration */}
          <div>
            <label>BMDC Registration Number</label>

            <input
              name="bmdcRegNo"
              placeholder="Example: A-66477"
              value={form.bmdcRegNo}
              onChange={onChange}
              className="input"
            />
          </div>

          {/* Designation */}
          <SelectField
            label="Designation"
            name="designation"
            value={form.designation}
            onChange={onChange}
            placeholder="Select designation"
            options={designations}
          />

          {/* Primary Hospital */}
          <SelectField
            label="Primary Hospital"
            name="primaryHospital"
            value={form.primaryHospital}
            onChange={onChange}
            placeholder="Select Primary Hospital"
            options={hospitals.map((hospital) => ({
              value: hospital.name,
              label: `${hospital.name} — ${hospital.city}`,
            }))}
          />
        </div>

        {/* Degrees + Specialities */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Degrees */}
          <MultiSelect
            label="Degrees"
            value={form.degrees}
            options={degrees}
            onChange={(e) => updateMultiSelect("degrees", e)}
            description="Hold Ctrl/Cmd to select more than one."
          />

          {/* Specialities */}
          <MultiSelect
            label="Specialities"
            value={form.specialities}
            options={specialties}
            onChange={(e) => updateMultiSelect("specialities", e)}
            description="Hold Ctrl/Cmd to select more than one."
          />
        </div>

        {/* <MultiSelect hint /> */}

        {/* Chambers */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-800">Chambers</h3>

              <p className="mt-1 text-xs text-slate-500">
                Add every chamber where the doctor sees patients.
              </p>
            </div>

            <button
              type="button"
              onClick={addChamber}
              className="flex items-center gap-1 text-sm font-medium text-blue-600"
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          <div className="space-y-5">
            {form.chambers.map((chamber, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-medium text-slate-800">
                    Chamber {index + 1}
                  </h4>

                  {form.chambers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeChamber(index)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 size={17} />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Chamber Name + Phone */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <SelectField
                      label="Chamber Name"
                      value={chamber.name}
                      onChange={(e) =>
                        updateChamber(index, "name", e.target.value)
                      }
                      placeholder="Select Chamber / Hospital"
                      options={hospitals.map((hospital) => ({
                        value: hospital.name,
                        label: `${hospital.name} — ${hospital.city}`,
                      }))}
                    />

                    <div>
                      <label>Chamber Phone</label>

                      <input
                        type="tel"
                        value={chamber.phone}
                        onChange={(e) =>
                          updateChamber(index, "phone", e.target.value)
                        }
                        placeholder="Chamber phone number"
                        className="input"
                      />
                    </div>
                  </div>

                  {/* Visiting Days + Visiting Time */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <MultiSelect
                      label="Visiting Days"
                      value={chamber.visitingDays}
                      options={days}
                      onChange={(e) => {
                        const values = Array.from(
                          e.target.selectedOptions,
                          (option) => option.value,
                        );

                        updateChamber(index, "visitingDays", values);
                      }}
                      description="Select the days doctor visits this chamber."
                    />

                    <div>
                      <label className="mb-2 block font-medium text-slate-700">
                        Visiting Time
                      </label>

                      <div className="flex flex-col items-start gap-2">
                        <div className="flex items-center gap-2">
                          <label className="mb-2 block font-medium text-slate-700">
                            From:
                          </label>
                          <TimeSelect
                            value={chamber.visitingTime.startHour}
                            onChange={(value) =>
                              updateVisitingTime(index, "startHour", value)
                            }
                          />

                          <PeriodSelect
                            value={chamber.visitingTime.startPeriod}
                            onChange={(value) =>
                              updateVisitingTime(index, "startPeriod", value)
                            }
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="mb-2 pr-4 block font-medium text-slate-700">
                            To:  
                          </label>

                          <TimeSelect
                            value={chamber.visitingTime.endHour}
                            onChange={(value) =>
                              updateVisitingTime(index, "endHour", value)
                            }
                          />

                          <PeriodSelect
                            value={chamber.visitingTime.endPeriod}
                            onChange={(value) =>
                              updateVisitingTime(index, "endPeriod", value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Full Address */}
                  <div>
                    <label>Chamber Address</label>

                    <textarea
                      value={chamber.address}
                      onChange={(e) =>
                        updateChamber(index, "address", e.target.value)
                      }
                      placeholder="Full chamber address"
                      className="input !min-h-18"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="mb-1 font-semibold text-slate-800">
            Doctor Contact Information
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label>Doctor Phone Number</label>

              <input
                type="tel"
                value={form.contactInfo.phones[0] || ""}
                onChange={(e) => updateContact("phones", 0, e.target.value)}
                placeholder="Phone number"
                className="input"
              />
            </div>

            <div>
              <label>Doctor Email Address</label>

              <input
                type="email"
                value={form.contactInfo.emails[0] || ""}
                onChange={(e) => updateContact("emails", 0, e.target.value)}
                placeholder="Email address"
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button type="submit" className="btn-primary w-full">
            {editingId ? "Update Doctor" : "Add Doctor"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={onReset}
              className="btn-secondary w-full"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </aside>
  );
}

function MultiSelect({
  label,
  value,
  options,
  onChange,
  description,
  hint = false,
}) {
  return (
    <div>
      <label className="mb-2 block font-medium text-slate-700">{label}</label>

      <select
        multiple
        value={value}
        onChange={onChange}
        className="input min-h-40"
      >
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const label = typeof option === "string" ? option : option.label;

          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>

      {hint && (
        <div className="mt-3 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-3 py-3">
          <div className="degree-hint-icon">
            <MousePointer2 size={17} />
          </div>

          <div>
            <p className="text-sm font-semibold text-blue-700">
              Select multiple degrees
            </p>

            <p className="mt-0.5 text-xs text-blue-600">
              Hold <kbd className="degree-hint-key">Ctrl</kbd>
              <span className="mx-1">/</span>
              <kbd className="degree-hint-key">Cmd</kbd> and click to select
              more than one.
            </p>
          </div>
        </div>
      )}

      {description && (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      )}
    </div>
  );
}

function SelectField({ label, name, value, onChange, placeholder, options }) {
  return (
    <div>
      <label>{label}</label>

      <select name={name} value={value} onChange={onChange} className="input">
        <option value="">{placeholder}</option>

        {options.map((option) => {
          const optionValue =
            typeof option === "string" ? option : option.value;
          const optionLabel =
            typeof option === "string" ? option : option.label;

          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function TimeSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input flex-1"
    >
      {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
        <option key={hour} value={hour}>
          {hour}
        </option>
      ))}
    </select>
  );
}

function PeriodSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input flex-1 !min-w-[80px]"
    >
      <option value="AM">AM</option>
      <option value="PM">PM</option>
    </select>
  );
}

// function ContactList({
//   label,
//   values,
//   placeholder,
//   type = "text",
//   onChange,
//   onAdd,
//   onRemove,
// }) {
//   return (
//     <div className="mb-4">
//       <div className="mb-2 flex items-center justify-between">
//         <label className="mb-0">{label}</label>

//         <button
//           type="button"
//           onClick={onAdd}
//           className="text-sm font-medium text-blue-600"
//         >
//           + Add
//         </button>
//       </div>

//       <div className="space-y-2">
//         {values.map((value, index) => (
//           <div key={index} className="flex gap-2">
//             <input
//               type={type}
//               value={value}
//               onChange={(e) => onChange(index, e.target.value)}
//               placeholder={placeholder}
//               className="input flex-1"
//             />

//             <button
//               type="button"
//               onClick={() => onRemove(index)}
//               className="rounded-xl border border-slate-200 px-3 text-slate-500 hover:text-red-600"
//             >
//               <Trash2 size={17} />
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
