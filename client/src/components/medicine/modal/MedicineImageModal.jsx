// client/src/components/medicine/modal/MedicineImageModal.jsx

// Manages medicine detail modal state and derived pricing information.
// Delegates the visual presentation to MedicineImageModalContent.

import { useEffect, useState } from "react";

import {
  getMedicinePricingType,
  getMonthlyMedicinePieces,
  getPricePerPiece,
  getMedicineMonthlyCost,
} from "../../../utils/medicine/medicineCalculations";

import MedicineImageModalContent from "./MedicineImageModalContent";

export default function MedicineImageModal({ medicine, onClose }) {
  // Tracks the current medicine image zoom level.
  const [zoom, setZoom] = useState(1);

  // Resets the zoom whenever the selected medicine changes.
  useEffect(() => {
    if (!medicine) {
      return;
    }

    setZoom(1);
  }, [medicine]);

  // Registers keyboard handling for closing the active modal.
  useEffect(() => {
    if (!medicine) {
      return;
    }

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

  // Prevents rendering when no medicine has been selected.
  if (!medicine) {
    return null;
  }

  // Calculates values required by the medicine detail presentation.
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

  // Increases zoom while keeping it within the supported maximum.
  function handleZoomIn() {
    setZoom((current) => Math.min(current + 0.25, 3));
  }

  // Decreases zoom while keeping it within the supported minimum.
  function handleZoomOut() {
    setZoom((current) => Math.max(current - 0.25, 0.5));
  }

  // Closes the modal when the overlay itself receives the click.
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
