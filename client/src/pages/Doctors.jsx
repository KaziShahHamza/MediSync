// client/src/pages/Doctors.jsx

import { Plus, Stethoscope } from "lucide-react";
import { useState } from "react";

import { useDoctors } from "../context/DoctorContext";
import { useDoctorForm } from "../hooks/doctor/useDoctorForm";

import DoctorCard from "../components/doctor/DoctorCard";
import DoctorForm from "../components/doctor/DoctorForm";
import DoctorModal from "../components/doctor/DoctorModal";

export default function Doctors() {
  const [isFormModalOpen, setIsFormModalOpen] =
    useState(false);

  const {
    doctors,
    fetchDoctors,
  } = useDoctors();

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
  } = useDoctorForm(
    fetchDoctors,
    () => setIsFormModalOpen(false),
  );

  function handleAddDoctor() {
    resetForm();
    setIsFormModalOpen(true);
  }

  function handleEditDoctor(doctor) {
    editDoctor(doctor);
    setIsFormModalOpen(true);
  }

  function handleCloseFormModal() {
    resetForm();
    setIsFormModalOpen(false);
  }

  return (
    <div className="container space-y-6 py-6">
      {/* Page Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Stethoscope size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Doctors
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your doctors, chambers, and professional
              information.
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

      {/* Doctors List */}
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
              Add your doctor information to keep your
              healthcare contacts organized in MediSync.
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
                {doctors.length}{" "}
                {doctors.length === 1
                  ? "doctor"
                  : "doctors"}
              </p>
            </div>

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

      {/* Add / Edit Doctor Modal */}
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

      {/* Doctor Details Modal */}
      <DoctorModal
        doctor={selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        onEdit={handleEditDoctor}
      />
    </div>
  );
}