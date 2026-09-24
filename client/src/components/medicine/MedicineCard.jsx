// client/src/components/medicine/MedicineCard.jsx

// Manages medicine card logic and delegates the card UI to MedicineCardContent.

import {
  getMedicinePricingType,
  getMonthlyMedicinePieces,
  getMedicineMonthlyCost,
} from "../../utils/medicine/medicineCalculations";

import MedicineCardContent from "./MedicineCardContent";

// Renders individual medicine summary card component
export default function MedicineCard({ medicine, onView, onEdit, onDelete }) {
  // Determine pricing configuration category
  const pricingType = getMedicinePricingType(medicine);

  // Check if medicine uses strip-based dosage calculations
  const isStripMedicine = pricingType === "strip";

  // Calculate projected monthly unit consumption
  const monthlyPieces = isStripMedicine
    ? getMonthlyMedicinePieces(medicine?.dosage)
    : Number(medicine?.unitsPerMonth) || 0;

  // Calculate monthly financial expenditure
  const monthlyCost = getMedicineMonthlyCost(medicine);

  // Derive active medication treatment status
  const isActive = medicine?.isActive !== false;

  // Fallback to empty dosage list if undefined
  const dosage = Array.isArray(medicine?.dosage) ? medicine.dosage : [];

  // Triggers main details view handler
  function handleCardClick() {
    onView(medicine);
  }

  // Prevents card click propagation when interacting with nested controls
  function stopCardClick(event) {
    event.stopPropagation();
  }

  // Handles edit button click action
  function handleEdit(event) {
    event.stopPropagation();
    onEdit(medicine);
  }

  // Handles delete button click action
  function handleDelete(event) {
    event.stopPropagation();
    onDelete(medicine._id);
  }

  return (
    <MedicineCardContent
      medicine={medicine}
      isStripMedicine={isStripMedicine}
      monthlyPieces={monthlyPieces}
      monthlyCost={monthlyCost}
      isActive={isActive}
      dosage={dosage}
      onCardClick={handleCardClick}
      onView={onView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onStopCardClick={stopCardClick}
    />
  );
}