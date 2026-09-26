// client/src/components/medicine/modal/MedicineFormModal.jsx

// Provides the modal container for adding or editing a medicine.
// Handles Escape-key and backdrop interactions independently from the form.

import { useEffect } from "react";

import MedicineForm from "./MedicineForm";

export default function MedicineFormModal({
  medicine = null,
  editing = false,
  onSave,
  onClose,
  loading = false,
}) {
  // Registers and cleans up the Escape-key listener while the modal is active.
  useEffect(() => {
    if (!editing) {
      return;
    }

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

  // Closes the modal only when the backdrop itself is clicked.
  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  // Avoids mounting modal content when the modal is inactive.
  if (!editing) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 px-4 py-6 sm:px-6"
      onMouseDown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={medicine ? "Edit medicine" : "Add medicine"}
    >
      <div className="flex min-h-full items-start justify-center sm:items-center">
        <div className="w-full max-w-3xl">
          {/* Renders the reusable medicine form inside the modal. */}
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
