// client/src/pages/Doctors.jsx

// Renders the doctor management page.
// Handles doctor listing, creation, editing, deletion, and details.

import { Plus, Stethoscope } from "lucide-react";
import { useState } from "react";

import { useDoctors } from "../context/DoctorContext";
import { useDoctorForm } from "../hooks/useDoctorForm";

import DoctorCard from "../components/doctor/DoctorCard";
import DoctorForm from "../components/doctor/DoctorForm";
import DoctorModal from "../components/doctor/DoctorModal";

// Provides doctor management controls and doctor information display.
export default function Doctors() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const { doctors, fetchDoctors } = useDoctors();

  const {
    form,
    setForm,
    editingId,
    selectedDoctor,
    setSelectedDoctor,
    handleChange,
    editDoctor,
    resetForm,
    saveDoctor,
    deleteDoctor,
  } = useDoctorForm(fetchDoctors, () => setIsFormModalOpen(false));

  // Opens an empty form for creating a doctor.
  function handleAddDoctor() {
    resetForm();
    setIsFormModalOpen(true);
  }

  // Loads a doctor into the form for editing.
  function handleEditDoctor(doctor) {
    editDoctor(doctor);
    setIsFormModalOpen(true);
  }

  // Resets the form and closes the form modal.
  function handleCloseFormModal() {
    resetForm();
    setIsFormModalOpen(false);
  }

  return (
    <div className="container space-y-6 py-6">
      {/* Page heading and add-doctor action. */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Stethoscope size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">Doctors</h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your doctors, chambers, and professional information.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddDoctor}
          className="btn-primary flex items-center justify-center gap-2 sm:w-auto"
        >
          <Plus size={18} />
          Add Doctor
        </button>
      </header>

      {/* Displays the doctor list or empty state. */}
      <section>
        {doctors.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Stethoscope size={26} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No doctors added yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Add your doctor information to keep your healthcare contacts
              organized in MediSync.
            </p>

            <button
              type="button"
              onClick={handleAddDoctor}
              className="btn-primary mx-auto mt-5 inline-flex items-center gap-2"
            >
              <Plus size={17} />
              Add Doctor
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Your Doctors
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                {doctors.length} {doctors.length === 1 ? "doctor" : "doctors"}
              </p>
            </div>

            {/* Displays doctors in a responsive card grid. */}
            <div className="grid gap-4 md:grid-cols-3">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor._id}
                  doctor={doctor}
                  onEdit={handleEditDoctor}
                  onDelete={deleteDoctor}
                  onOpen={setSelectedDoctor}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Displays the add or edit doctor form modal. */}
      {isFormModalOpen && (
        <DoctorForm
          form={form}
          editingId={editingId}
          onChange={handleChange}
          onSubmit={saveDoctor}
          onReset={resetForm}
          setForm={setForm}
          onClose={handleCloseFormModal}
        />
      )}

      {/* Displays details for the selected doctor. */}
      <DoctorModal
        doctor={selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        onEdit={handleEditDoctor}
      />
    </div>
  );
}
