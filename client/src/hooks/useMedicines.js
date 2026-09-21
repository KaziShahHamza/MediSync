// client/src/hooks/useMedicines.js

// Provides a simple hook for consuming the MedicineContext.
// Keeps medicine page components independent from React context implementation details.

import {
  useContext,
} from "react";

import {
  MedicineContext,
} from "../context/MedicineContext";

export default function useMedicines() {
  const context =
    useContext(MedicineContext);

  if (!context) {
    throw new Error(
      "useMedicines must be used inside a MedicineProvider.",
    );
  }

  return context;
}