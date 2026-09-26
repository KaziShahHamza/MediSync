// client/src/components/medicine/MedicineList.jsx

// Displays active and completed medicines in separate sections.
// Owns the selected medicine state and controls the detail modal.

import { useState } from "react";

import MedicineCard from "./MedicineCard";
import MedicineImageModal from "./modal/MedicineImageModal";

export default function MedicineList({
  medicines = [],
  onEdit,
  onDelete,
  loading = false,
}) {
  // Stores the medicine currently selected for detailed inspection.
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  // Separates active and completed medicines for grouped rendering.
  const activeMedicines = medicines.filter(
    (medicine) => medicine?.isActive !== false,
  );

  const pastMedicines = medicines.filter(
    (medicine) => medicine?.isActive === false,
  );

  // Opens the detail modal for the selected medicine.
  function handleView(medicine) {
    setSelectedMedicine(medicine);
  }

  // Clears the selected medicine and closes the detail modal.
  function handleCloseModal() {
    setSelectedMedicine(null);
  }

  // Shows a loading state while the initial medicine list is unavailable.
  if (loading && medicines.length === 0) {
    return (
      <section className="card">
        <div className="flex min-h-40 items-center justify-center">
          <p className="text-sm text-slate-500">Loading medicines...</p>
        </div>
      </section>
    );
  }

  // Shows an empty state when no medicines have been added.
  if (medicines.length === 0) {
    return (
      <section className="card">
        <div className="flex min-h-48 flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <span className="text-xl text-slate-400">+</span>
          </div>

          <h3 className="mt-4 text-base font-semibold text-slate-800">
            No medicines yet
          </h3>

          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Add your medicines to keep your treatment information organized.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Groups current and completed treatments into separate sections. */}
      <div className="space-y-6">
        {activeMedicines.length > 0 && (
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Current Medicines
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Medicines you are currently taking.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {/* Renders each currently active medicine. */}
              {activeMedicines.map((medicine) => (
                <MedicineCard
                  key={medicine._id}
                  medicine={medicine}
                  onView={handleView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </section>
        )}

        {pastMedicines.length > 0 && (
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Past Medicines
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Medicines with completed treatment periods.
              </p>
            </div>

            <div className="grid gap-4">
              {/* Renders each completed medicine treatment. */}
              {pastMedicines.map((medicine) => (
                <MedicineCard
                  key={medicine._id}
                  medicine={medicine}
                  onView={handleView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Displays detailed information for the selected medicine. */}
      <MedicineImageModal
        medicine={selectedMedicine}
        onClose={handleCloseModal}
      />
    </>
  );
}
