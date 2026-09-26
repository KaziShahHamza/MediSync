// client/src/pages/Medicines.jsx

// Renders the medicine management page.
// Handles medicine creation, editing, deletion, and modal state.

import { useState } from "react";
import { Pill, PlusCircle } from "lucide-react";

import MedicineFormModal from "../components/medicine/modal/MedicineFormModal";
import MedicineList from "../components/medicine/MedicineList";
import MedicineMonthlyCost from "../components/medicine/MedicineMonthlyCost";

import useMedicines from "../hooks/useMedicines";

// Provides the main medicine management interface.
export default function Medicines() {
  const { medicines, loading, createMedicine, updateMedicine, deleteMedicine } =
    useMedicines();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Opens the form in create mode.
  function openAddForm() {
    setEditing(null);
    setFormOpen(true);
  }

  // Opens the form with the selected medicine.
  function openEditForm(medicine) {
    setEditing(medicine);
    setFormOpen(true);
  }

  // Closes the form unless a medicine operation is in progress.
  function closeForm() {
    if (loading) {
      return;
    }

    setFormOpen(false);
    setEditing(null);
  }

  // Saves either a new medicine or an existing medicine.
  async function handleSave(medicineData) {
    if (editing?._id) {
      await updateMedicine(editing._id, medicineData);
    } else {
      await createMedicine(medicineData);
    }

    setFormOpen(false);
    setEditing(null);
  }

  // Confirms and removes a medicine record.
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
      {/* Page heading and medicine creation action. */}
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

        <button
          type="button"
          onClick={openAddForm}
          className="btn-primary inline-flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} />
          Add Medicine
        </button>
      </header>

      {/* Displays the calculated monthly medicine cost. */}
      <MedicineMonthlyCost medicines={medicines} />

      {/* Displays all medicine records and available actions. */}
      <MedicineList
        medicines={medicines}
        onEdit={openEditForm}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Provides the create and edit medicine form. */}
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
