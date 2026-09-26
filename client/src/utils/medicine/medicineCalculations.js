// client/src/utils/medicineCalculations.js

// Provides reusable medicine pricing and monthly cost calculations.
// Supports strip-based and unit-based medicine pricing models.

const DAYS_PER_MONTH = 30;

const STRIP_MEDICINE_TYPES = ["tablet", "capsule"];

// Resolves whether a medicine uses strip-based or unit-based pricing.
export function getMedicinePricingType(medicineOrType) {
  const type =
    typeof medicineOrType === "string" ? medicineOrType : medicineOrType?.type;

  // Uses stored pricingType when available for backward compatibility.
  if (
    typeof medicineOrType === "object" &&
    (medicineOrType?.pricingType === "strip" ||
      medicineOrType?.pricingType === "unit")
  ) {
    return medicineOrType.pricingType;
  }

  return STRIP_MEDICINE_TYPES.includes(type) ? "strip" : "unit";
}

// Calculates the total number of medicine pieces taken per day.
export function getDailyMedicinePieces(dosage = []) {
  if (!Array.isArray(dosage)) {
    return 0;
  }

  return dosage.reduce((total, item) => {
    const quantity = Number(item?.quantity);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      return total;
    }

    return total + quantity;
  }, 0);
}

// Calculates expected medicine pieces over the selected number of days.
export function getMonthlyMedicinePieces(
  dosage = [],
  daysPerMonth = DAYS_PER_MONTH,
) {
  const dailyPieces = getDailyMedicinePieces(dosage);
  const days = Number(daysPerMonth);

  if (!Number.isFinite(days) || days <= 0) {
    return 0;
  }

  return dailyPieces * days;
}

// Calculates the price of one medicine piece from strip pricing.
export function getPricePerPiece(pricePerStrip, piecesPerStrip) {
  const price = Number(pricePerStrip);
  const pieces = Number(piecesPerStrip);

  if (
    !Number.isFinite(price) ||
    price < 0 ||
    !Number.isFinite(pieces) ||
    pieces <= 0
  ) {
    return 0;
  }

  return price / pieces;
}

// Calculates monthly cost for a strip-priced medicine.
export function getStripMedicineMonthlyCost(
  medicine,
  daysPerMonth = DAYS_PER_MONTH,
) {
  if (!medicine) {
    return 0;
  }

  const monthlyPieces = getMonthlyMedicinePieces(medicine.dosage, daysPerMonth);

  const pricePerPiece = getPricePerPiece(
    medicine.pricePerStrip,
    medicine.piecesPerStrip,
  );

  return monthlyPieces * pricePerPiece;
}

// Calculates monthly cost for a unit-priced medicine.
export function getUnitMedicineMonthlyCost(medicine) {
  if (!medicine) {
    return 0;
  }

  const pricePerUnit = Number(medicine.pricePerUnit);
  const unitsPerMonth = Number(medicine.unitsPerMonth);

  if (
    !Number.isFinite(pricePerUnit) ||
    pricePerUnit < 0 ||
    !Number.isFinite(unitsPerMonth) ||
    unitsPerMonth < 0
  ) {
    return 0;
  }

  return pricePerUnit * unitsPerMonth;
}

// Calculates the monthly cost for one medicine using its pricing model.
export function getMedicineMonthlyCost(
  medicine,
  daysPerMonth = DAYS_PER_MONTH,
) {
  if (!medicine) {
    return 0;
  }

  const pricingType = getMedicinePricingType(medicine);

  if (pricingType === "strip") {
    return getStripMedicineMonthlyCost(medicine, daysPerMonth);
  }

  return getUnitMedicineMonthlyCost(medicine);
}

// Calculates the combined monthly cost of all active medicines.
export function getTotalMonthlyMedicineCost(
  medicines = [],
  daysPerMonth = DAYS_PER_MONTH,
) {
  if (!Array.isArray(medicines)) {
    return 0;
  }

  return medicines
    .filter((medicine) => medicine?.isActive !== false)
    .reduce(
      (total, medicine) =>
        total + getMedicineMonthlyCost(medicine, daysPerMonth),
      0,
    );
}

// Formats a medicine price with two decimal places.
export function formatMedicinePrice(value) {
  const price = Number(value);

  if (!Number.isFinite(price)) {
    return "৳0.00";
  }

  return `৳${price.toFixed(2)}`;
}
