// client/src/pages/Medicines.jsx

// Composes the medicine page from the shared medicine data layer and UI components.
// Handles page-level medicine actions and controls the add/edit form modal.

import { useState } from "react";

import { Pill, PlusCircle } from "lucide-react";

import MedicineFormModal from "../components/medicine/MedicineFormModal";
import MedicineList from "../components/medicine/MedicineList";
import MedicineMonthlyCost from "../components/medicine/MedicineMonthlyCost";

import useMedicines from "../hooks/useMedicines";

// Renders the main medicines management page.
export default function Medicines() {
  // Accesses medicine CRUD operations and global state.
  const { medicines, loading, createMedicine, updateMedicine, deleteMedicine } =
    useMedicines();

  // Controls modal visibility.
  const [formOpen, setFormOpen] = useState(false);

  // Holds medicine record currently being edited.
  const [editing, setEditing] = useState(null);

  // Opens modal in creation mode.
  function openAddForm() {
    setEditing(null);
    setFormOpen(true);
  }

  // Opens modal populated with selected medicine for editing.
  function openEditForm(medicine) {
    setEditing(medicine);
    setFormOpen(true);
  }

  // Closes form modal and clears edit state.
  function closeForm() {
    if (loading) {
      return;
    }

    setFormOpen(false);
    setEditing(null);
  }

  // Handles saving new or updated medicine records.
  async function handleSave(medicineData) {
    if (editing?._id) {
      await updateMedicine(editing._id, medicineData);
    } else {
      await createMedicine(medicineData);
    }

    setFormOpen(false);
    setEditing(null);
  }

  // Confirms and processes medicine deletion.
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this medicine?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMedicine(id);

      if (editing?._id === id) {
        setFormOpen(false);
        setEditing(null);
      }
    } catch (error) {
      console.error("Failed to delete medicine:", error);

      window.alert(error?.message || "Failed to delete medicine.");
    }
  }

  return (
    <main className="container space-y-6 py-6">
      {/* Header section with page title and action button */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <Pill size={22} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">Medicines</h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your medicines, dosage schedules, treatment periods, and
              costs.
            </p>
          </div>
        </div>

        {/* Trigger button for adding a new medicine */}
        <button
          type="button"
          onClick={openAddForm}
          className="btn-primary inline-flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} />
          Add Medicine
        </button>
      </header>

      {/* Aggregate monthly expenditure summary card */}
      <MedicineMonthlyCost medicines={medicines} />

      {/* Primary list displaying active and inactive medicines */}
      <MedicineList
        medicines={medicines}
        onEdit={openEditForm}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Modal dialog for creating and updating medicine entries */}
      <MedicineFormModal
        medicine={editing}
        editing={formOpen}
        onSave={handleSave}
        onClose={closeForm}
        loading={loading}
      />
    </main>
  );
}
