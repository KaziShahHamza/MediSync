// client/src/components/doctor/DoctorForm.jsx

// Renders the add/edit doctor form inside a modal.
// Combines doctor information, professional details, and chamber management.

import { X } from "lucide-react";

import ChamberForm from "./chamber/ChamberForm";
import DoctorFormSection from "./DoctorFormSection";
import { MultiSelect, SelectField } from "./DoctorFormFields";

import primaryHospitals from "../../data/doctor/primaryHospitals";
import {
  days,
  designations,
  degrees,
  specialties,
} from "../../data/doctor/doctorData";

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
  // Update one phone or email entry inside contact information.
  function updateContact(type, index, value) {
    setForm((previousForm) => ({
      ...previousForm,
      contactInfo: {
        ...previousForm.contactInfo,
        [type]: previousForm.contactInfo[type].map((item, itemIndex) =>
          itemIndex === index ? value : item,
        ),
      },
    }));
  }

  // Update a multi-select field with all selected values.
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

  // Reset the form before closing the modal.
  function handleCancel() {
    onReset();
    onClose();
  }

  // Render the complete doctor form inside the modal shell.
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
        onMouseDown={(event) => event.stopPropagation()}
      >
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

          <button
            type="button"
            onClick={handleCancel}
            className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close doctor form"
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto">
          <form
            id="doctor-form"
            onSubmit={onSubmit}
            className="grid gap-6 p-5 sm:p-6 lg:grid-cols-2"
          >
            <DoctorFormSection title="Basic Information">
              <div className="space-y-4">
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
            </DoctorFormSection>

            <DoctorFormSection title="Professional Information">
              <div className="space-y-4">
                <MultiSelect
                  label="Degrees"
                  options={degrees}
                  value={form.degrees}
                  onChange={(event) => updateMultiSelect("degrees", event)}
                  placeholder="Select degrees"
                />

                <MultiSelect
                  label="Specialities"
                  options={specialties}
                  value={form.specialities}
                  onChange={(event) => updateMultiSelect("specialities", event)}
                  placeholder="Select specialities"
                />
              </div>
            </DoctorFormSection>

            <DoctorFormSection title="Chambers" className="lg:col-span-2">
              <ChamberForm form={form} setForm={setForm} days={days} />
            </DoctorFormSection>
          </form>
        </div>

        <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button type="submit" form="doctor-form" className="btn-primary">
            {editingId ? "Update Doctor" : "Add Doctor"}
          </button>
        </div>
      </div>
    </div>
  );
}
