// client/src/hooks/useMedicines.js

// Provides a safe consumer hook for MedicineContext.
// Keeps medicine components independent from the underlying context implementation.

import { useContext } from "react";

import { MedicineContext } from "../context/MedicineContext";

export default function useMedicines() {
  // Read the current medicine context value.
  const context = useContext(MedicineContext);

  // Prevent usage outside the required provider.
  if (!context) {
    throw new Error("useMedicines must be used inside a MedicineProvider.");
  }

  return context;
}
