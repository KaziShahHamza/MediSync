// client/src/components/medicine/modal/MedicineImageModal.jsx

// Manages medicine modal state and delegates the modal UI to MedicineImageModalContent.

import { useEffect, useState } from "react";

import {
  getMedicinePricingType,
  getMonthlyMedicinePieces,
  getPricePerPiece,
  getMedicineMonthlyCost,
} from "../../../utils/medicine/medicineCalculations";

import MedicineImageModalContent from "./MedicineImageModalContent";

// Renders full medicine details inside a modal.
export default function MedicineImageModal({ medicine, onClose }) {
  // Manages image zoom level state.
  const [zoom, setZoom] = useState(1);

  // Resets zoom level when a new medicine is selected.
  useEffect(() => {
    if (!medicine) return;

    setZoom(1);
  }, [medicine]);

  // Registers keyboard shortcut listener for Escape key to close modal.
  useEffect(() => {
    if (!medicine) return;

    // Handles the Escape keypress event.
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [medicine, onClose]);

  // Prevents rendering if no medicine is selected.
  if (!medicine) {
    return null;
  }

  // Determines medicine pricing structure.
  const pricingType = getMedicinePricingType(medicine);

  const isStripMedicine = pricingType === "strip";

  const dosage = Array.isArray(medicine.dosage) ? medicine.dosage : [];

  const monthlyPieces = isStripMedicine
    ? getMonthlyMedicinePieces(dosage)
    : Number(medicine.unitsPerMonth) || 0;

  const pricePerPiece = isStripMedicine
    ? getPricePerPiece(medicine.pricePerStrip, medicine.piecesPerStrip)
    : 0;

  const monthlyCost = getMedicineMonthlyCost(medicine);

  const isActive = medicine.isActive !== false;

  // Increases image zoom scale up to maximum limit.
  function handleZoomIn() {
    setZoom((current) => Math.min(current + 0.25, 3));
  }

  // Decreases image zoom scale down to minimum limit.
  function handleZoomOut() {
    setZoom((current) => Math.max(current - 0.25, 0.5));
  }

  // Closes modal when clicking directly on overlay backdrop.
  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <MedicineImageModalContent
      medicine={medicine}
      isStripMedicine={isStripMedicine}
      dosage={dosage}
      monthlyPieces={monthlyPieces}
      pricePerPiece={pricePerPiece}
      monthlyCost={monthlyCost}
      isActive={isActive}
      zoom={zoom}
      onClose={onClose}
      onZoomIn={handleZoomIn}
      onZoomOut={handleZoomOut}
      onOverlayClick={handleOverlayClick}
    />
  );
}