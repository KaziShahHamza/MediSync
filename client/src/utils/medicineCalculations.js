// client/src/utils/medicineCalculations.js

const DAYS_PER_MONTH = 30;

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

export function getMonthlyMedicinePieces(
  dosage = [],
  daysPerMonth = DAYS_PER_MONTH,
) {
  const dailyPieces = getDailyMedicinePieces(dosage);

  return dailyPieces * daysPerMonth;
}

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

export function getMonthlyMedicineCost(
  dosage = [],
  pricePerStrip,
  piecesPerStrip,
  daysPerMonth = DAYS_PER_MONTH,
) {
  const monthlyPieces = getMonthlyMedicinePieces(
    dosage,
    daysPerMonth,
  );

  const pricePerPiece = getPricePerPiece(
    pricePerStrip,
    piecesPerStrip,
  );

  return monthlyPieces * pricePerPiece;
}

export function formatMedicinePrice(value) {
  const price = Number(value);

  if (!Number.isFinite(price)) {
    return "৳0.00";
  }

  return `৳${price.toFixed(2)}`;
}