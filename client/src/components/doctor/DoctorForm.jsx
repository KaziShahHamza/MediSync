import { X } from "lucide-react";

import ChamberForm from "./ChamberForm";
import { MultiSelect, SelectField } from "./DoctorFormFields";

import primaryHospitals from "../../data/primaryHospitals";
import specialties from "../../data/specialties.json";
import designations from "../../data/designations.json";
import days from "../../data/days.json";
import degrees from "../../data/degrees.json";

import { lastVisitYears } from "../../utils/doctor/doctorFormUtils";

export default function DoctorForm({
  form,
  editingId,
  onChange,
  onSubmit,
  onReset,
  setForm,
  onClose,
}) {
  function updateContact(type, index, value) {
    setForm((previousForm) => ({
      ...previousForm,
      contactInfo: {
        ...previousForm.contactInfo,
        [type]: previousForm.contactInfo[type].map(
          (item, itemIndex) =>
            itemIndex === index ? value : item,
        ),
      },
    }));
  }

  function updateMultiSelect(field, event) {
    const values = Array.from(
      event.target.selectedOptions,
      (option) => option.value,
    );

    setForm((previousForm) => ({
      ...previousForm,
      [field]: values,
    }));
  }

  function handleCancel() {
    onReset();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="doctor-form-title"
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div>
            <h2
              id="doctor-form-title"
              className="text-xl font-semibold text-slate-900"
            >
              {editingId ? "Update Doctor" : "Add Doctor"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editingId
                ? "Update the doctor's information below."
                : "Add a doctor to your MediSync health record."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCancel}
            className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close doctor form"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form content */}
        <div className="min-h-0 overflow-y-auto">
          <form
            id="doctor-form"
            onSubmit={onSubmit}
            className="grid gap-6 p-5 sm:p-6 lg:grid-cols-2"
          >
            {/* Basic Information */}
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Basic Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Doctor Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Dr. John Doe"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    BMDC Registration No.
                  </label>

                  <input
                    type="text"
                    name="bmdcRegNo"
                    value={form.bmdcRegNo}
                    onChange={onChange}
                    placeholder="A-12345"
                    className="input"
                  />
                </div>

                <SelectField
                  label="Designation"
                  name="designation"
                  value={form.designation}
                  onChange={onChange}
                  options={designations}
                  placeholder="Select designation"
                />

                <SelectField
                  label="Primary Hospital"
                  name="primaryHospital"
                  value={form.primaryHospital}
                  onChange={onChange}
                  options={primaryHospitals}
                  placeholder="Select primary hospital"
                />

                <SelectField
                  label="Last Visit"
                  name="lastVisit"
                  value={form.lastVisit}
                  onChange={onChange}
                  options={lastVisitYears}
                  placeholder="Select year"
                />
              </div>
            </section>

            {/* Professional Information */}
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Professional Information
              </h3>

              <div className="space-y-4">
                <MultiSelect
                  label="Degrees"
                  options={degrees}
                  value={form.degrees}
                  onChange={(event) =>
                    updateMultiSelect(
                      "degrees",
                      event,
                    )
                  }
                  placeholder="Select degrees"
                />

                <MultiSelect
                  label="Specialities"
                  options={specialties}
                  value={form.specialities}
                  onChange={(event) =>
                    updateMultiSelect(
                      "specialities",
                      event,
                    )
                  }
                  placeholder="Select specialities"
                />
              </div>
            </section>

            {/* Chambers */}
            <section className="lg:col-span-2">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Chambers
              </h3>

              <ChamberForm
                form={form}
                setForm={setForm}
                days={days}
              />
            </section>

            {/* Contact Information */}
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Contact Information
              </h3>

              <div className="space-y-4">
                {form.contactInfo.phones.map(
                  (phone, index) => (
                    <div key={`phone-${index}`}>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Phone {index + 1}
                      </label>

                      <input
                        type="tel"
                        value={phone}
                        onChange={(event) =>
                          updateContact(
                            "phones",
                            index,
                            event.target.value,
                          )
                        }
                        placeholder="01XXXXXXXXX"
                        className="input"
                      />
                    </div>
                  ),
                )}

                {form.contactInfo.emails.map(
                  (email, index) => (
                    <div key={`email-${index}`}>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Email {index + 1}
                      </label>

                      <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                          updateContact(
                            "emails",
                            index,
                            event.target.value,
                          )
                        }
                        placeholder="doctor@example.com"
                        className="input"
                      />
                    </div>
                  ),
                )}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Website
                  </label>

                  <input
                    type="url"
                    value={form.contactInfo.website}
                    onChange={(event) =>
                      setForm((previousForm) => ({
                        ...previousForm,
                        contactInfo: {
                          ...previousForm.contactInfo,
                          website: event.target.value,
                        },
                      }))
                    }
                    placeholder="https://example.com"
                    className="input"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Facebook
                  </label>

                  <input
                    type="url"
                    value={form.contactInfo.facebook}
                    onChange={(event) =>
                      setForm((previousForm) => ({
                        ...previousForm,
                        contactInfo: {
                          ...previousForm.contactInfo,
                          facebook:
                            event.target.value,
                        },
                      }))
                    }
                    placeholder="Facebook profile URL"
                    className="input"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    LinkedIn
                  </label>

                  <input
                    type="url"
                    value={form.contactInfo.linkedin}
                    onChange={(event) =>
                      setForm((previousForm) => ({
                        ...previousForm,
                        contactInfo: {
                          ...previousForm.contactInfo,
                          linkedin:
                            event.target.value,
                        },
                      }))
                    }
                    placeholder="LinkedIn profile URL"
                    className="input"
                  />
                </div>
              </div>
            </section>

            {/* Notes */}
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Notes
              </h3>

              <textarea
                name="notes"
                value={form.notes}
                onChange={onChange}
                rows={8}
                placeholder="Additional notes about this doctor..."
                className="input resize-none"
              />
            </section>
          </form>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="doctor-form"
            className="btn-primary"
          >
            {editingId ? "Update Doctor" : "Add Doctor"}
          </button>
        </div>
      </div>
    </div>
  );
}