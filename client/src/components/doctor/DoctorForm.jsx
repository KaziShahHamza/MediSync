// client/src/components/doctor/DoctorForm.jsx

// Renders the add/edit doctor form inside a modal.
// Combines doctor information, professional details, and chamber management.

import { X } from "lucide-react";

import ChamberForm from "./ChamberForm";
import DoctorFormSection from "./DoctorFormSection";
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
  // Updates one phone or email entry inside contact information.
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

  // Updates a multi-select field with all currently selected values.
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

  // Resets the form and closes the modal.
  function handleCancel() {
    onReset();
    onClose();
  }

  return (
    // Modal shell: keeps the form responsive and scrollable on smaller screens.
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="doctor-form-title"
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
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

          {/* Closes the doctor form modal. */}
          <button
            type="button"
            onClick={handleCancel}
            className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close doctor form"
          >
            <X size={20} />
          </button>
        </div>

        {/* Two-column desktop / one-column mobile form. */}
        <div className="min-h-0 overflow-y-auto">
          <form
            id="doctor-form"
            onSubmit={onSubmit}
            className="grid gap-6 p-5 sm:p-6 lg:grid-cols-2"
          >
            <DoctorFormSection title="Basic Information">
              <div className="space-y-4">
                {/* Captures the doctor's basic identity. */}
                <div>
                  <label>Doctor Name</label>

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

                {/* Captures the doctor's BMDC registration number. */}
                <div>
                  <label>BMDC Registration No.</label>

                  <input
                    type="text"
                    name="bmdcRegNo"
                    value={form.bmdcRegNo}
                    onChange={onChange}
                    placeholder="A-12345"
                    className="input"
                  />
                </div>

                {/* Selects the doctor's professional designation. */}
                <SelectField
                  label="Designation"
                  name="designation"
                  value={form.designation}
                  onChange={onChange}
                  options={designations}
                  placeholder="Select designation"
                />

                {/* Selects the doctor's primary hospital. */}
                <SelectField
                  label="Primary Hospital"
                  name="primaryHospital"
                  value={form.primaryHospital}
                  onChange={onChange}
                  options={primaryHospitals}
                  placeholder="Select primary hospital"
                />

                {/* Records the year of the user's last visit. */}
                <SelectField
                  label="Last Visit"
                  name="lastVisit"
                  value={form.lastVisit}
                  onChange={onChange}
                  options={lastVisitYears}
                  placeholder="Select year"
                />
              </div>
            </DoctorFormSection>

            <DoctorFormSection title="Professional Information">
              <div className="space-y-4">
                {/* Selects one or more professional degrees. */}
                <MultiSelect
                  label="Degrees"
                  options={degrees}
                  value={form.degrees}
                  onChange={(event) =>
                    updateMultiSelect("degrees", event)
                  }
                  placeholder="Select degrees"
                />

                {/* Selects one or more medical specialities. */}
                <MultiSelect
                  label="Specialities"
                  options={specialties}
                  value={form.specialities}
                  onChange={(event) =>
                    updateMultiSelect("specialities", event)
                  }
                  placeholder="Select specialities"
                />
              </div>
            </DoctorFormSection>

            {/* Renders all chamber-related fields. */}
            <DoctorFormSection
              title="Chambers"
              className="lg:col-span-2"
            >
              <ChamberForm
                form={form}
                setForm={setForm}
                days={days}
              />
            </DoctorFormSection>

            {/* <DoctorFormSection title="Contact Information">
              <div className="space-y-4">
                {form.contactInfo.phones.map((phone, index) => (
                  <div key={`phone-${index}`}>
                    <label>Phone {index + 1}</label>

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
                ))}

                {form.contactInfo.emails.map((email, index) => (
                  <div key={`email-${index}`}>
                    <label>Email {index + 1}</label>

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
                ))}

                {["website", "facebook", "linkedin"].map((field) => (
                  <div key={field}>
                    <label className="capitalize">
                      {field}
                    </label>

                    <input
                      type="url"
                      value={form.contactInfo[field]}
                      onChange={(event) =>
                        setForm((previousForm) => ({
                          ...previousForm,
                          contactInfo: {
                            ...previousForm.contactInfo,
                            [field]: event.target.value,
                          },
                        }))
                      }
                      placeholder={`${field} URL`}
                      className="input"
                    />
                  </div>
                ))}
              </div>
            </DoctorFormSection> */}
{/* 
            <DoctorFormSection title="Notes">
              <textarea
                name="notes"
                value={form.notes}
                onChange={onChange}
                rows={8}
                placeholder="Additional notes about this doctor..."
                className="input resize-none"
              />
            </DoctorFormSection> */}
          </form>
        </div>

        {/* Footer: actions stay visible while the form content scrolls. */}
        <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 px-5 py-4 sm:px-6">
          {/* Cancels editing and closes the form. */}
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          {/* Submits either a new or updated doctor. */}
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

