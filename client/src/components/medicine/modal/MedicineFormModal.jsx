// client/src/components/medicine/MedicineFormModal.jsx

// Provides the modal container for adding or editing a medicine.
// Keeps modal behavior separate from the medicine form itself.

import { useEffect } from "react";

import MedicineForm from "./MedicineForm";

// Renders the modal dialog wrapper for medicine creation and editing.
export default function MedicineFormModal({
  medicine = null,
  editing = false,
  onSave,
  onClose,
  loading = false,
}) {
  // Registers keydown event listener to close modal on Escape key press.
  useEffect(() => {
    if (!editing) {
      return;
    }

    // Handles the Escape keypress event.
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [editing, onClose]);

  // Closes modal when clicking directly on the backdrop overlay.
  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  // Prevents rendering if modal is not in editing state.
  if (!editing) {
    return null;
  }

  return (
    // Modal backdrop container
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 px-4 py-6 sm:px-6"
      onMouseDown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={medicine ? "Edit medicine" : "Add medicine"}
    >
      <div className="flex min-h-full items-start justify-center sm:items-center">
        <div className="w-full max-w-3xl">
          {/* Form component for inputting or editing medicine details */}
          <MedicineForm
            onSave={onSave}
            editing={medicine}
            onCancel={onClose}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}