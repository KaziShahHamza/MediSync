// client/src/components/medicine/MedicineList.jsx

// Displays active and completed medicines in separate sections.
// Owns the selected medicine state and opens the medicine detail modal.

import { useState } from "react";

import MedicineCard from "./MedicineCard";
import MedicineImageModal from "./modal/MedicineImageModal";

// Manages rendering for grouped collections of active and past medicine items.
export default function MedicineList({
  medicines = [],
  onEdit,
  onDelete,
  loading = false,
}) {
  // Stores currently selected medicine for modal detail view.
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  // Filters dataset into active vs completed medicines.
  const activeMedicines = medicines.filter(
    (medicine) => medicine?.isActive !== false,
  );

  const pastMedicines = medicines.filter(
    (medicine) => medicine?.isActive === false,
  );

  // Sets selected medicine to trigger opening detail modal.
  function handleView(medicine) {
    setSelectedMedicine(medicine);
  }

  // Clears selected medicine state to close detail modal.
  function handleCloseModal() {
    setSelectedMedicine(null);
  }

  // Loading state placeholder view
  if (loading && medicines.length === 0) {
    return (
      <section className="card">
        <div className="flex min-h-40 items-center justify-center">
          <p className="text-sm text-slate-500">Loading medicines...</p>
        </div>
      </section>
    );
  }

  // Empty state placeholder view
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
      <div className="space-y-6">
        {/* Active medicines list section */}
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
              {/* Maps active medicine list items */}
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

        {/* Completed medicines list section */}
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
              {/* Maps past medicine list items */}
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

      {/* Medicine detail inspection modal */}
      <MedicineImageModal
        medicine={selectedMedicine}
        onClose={handleCloseModal}
      />
    </>
  );
}
