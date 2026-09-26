// client/src/components/medicine/MedicineCard.jsx

// Calculates medicine summary values and interaction handlers.
// Delegates visual rendering to MedicineCardContent.

import {
  getMedicinePricingType,
  getMonthlyMedicinePieces,
  getMedicineMonthlyCost,
} from "../../utils/medicine/medicineCalculations";

import MedicineCardContent from "./MedicineCardContent";

export default function MedicineCard({ medicine, onView, onEdit, onDelete }) {
  // Determines which pricing model the medicine uses.
  const pricingType = getMedicinePricingType(medicine);

  // Identifies whether dosage is calculated from strip usage.
  const isStripMedicine = pricingType === "strip";

  // Calculates projected monthly medicine consumption.
  const monthlyPieces = isStripMedicine
    ? getMonthlyMedicinePieces(medicine?.dosage)
    : Number(medicine?.unitsPerMonth) || 0;

  // Calculates the estimated monthly medicine cost.
  const monthlyCost = getMedicineMonthlyCost(medicine);

  // Determines the current treatment status.
  const isActive = medicine?.isActive !== false;

  // Normalizes dosage data before passing it to the presentation component.
  const dosage = Array.isArray(medicine?.dosage) ? medicine.dosage : [];

  // Opens the selected medicine details view.
  function handleCardClick() {
    onView(medicine);
  }

  // Prevents nested controls from triggering the parent card action.
  function stopCardClick(event) {
    event.stopPropagation();
  }

  // Opens the medicine edit flow.
  function handleEdit(event) {
    event.stopPropagation();
    onEdit(medicine);
  }

  // Opens the medicine deletion flow.
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
