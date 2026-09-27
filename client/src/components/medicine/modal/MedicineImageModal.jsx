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
  const [zoomState, setZoomState] = useState({
    medicineId: null,
    value: 1,
  });

  // Register the Escape-key handler only while the modal has a medicine.
  useEffect(() => {
    if (!medicine) {
      return undefined;
    }

    // Close the modal when the user presses Escape.
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Remove the listener when the modal closes or dependencies change.
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [medicine, onClose]);

  if (!medicine) {
    return null;
  }

  const medicineId = medicine._id;

  // Use the default zoom when this medicine has not been zoomed yet.
  const zoom = zoomState.medicineId === medicineId ? zoomState.value : 1;

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

  function handleZoomIn() {
    // Increase zoom only for the currently displayed medicine.
    setZoomState({
      medicineId,
      value: Math.min(zoom + 0.25, 3),
    });
  }

  function handleZoomOut() {
    // Prevent the image from becoming smaller than the minimum zoom level.
    setZoomState({
      medicineId,
      value: Math.max(zoom - 0.25, 0.5),
    });
  }

  function handleOverlayClick(event) {
    // Close the modal only when the backdrop itself receives the click.
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
