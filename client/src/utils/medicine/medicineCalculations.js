// client/src/utils/medicineCalculations.js

const DAYS_PER_MONTH = 30;

const STRIP_MEDICINE_TYPES = [
  "tablet",
  "capsule",
];

/*
 * ============================================================
 * PRICING TYPE
 * ============================================================
 */

export function getMedicinePricingType(
  medicineOrType,
) {
  const type =
    typeof medicineOrType === "string"
      ? medicineOrType
      : medicineOrType?.type;

  /*
   * Prefer the stored pricingType when available.
   * This also keeps older records working.
   */

  if (
    typeof medicineOrType === "object" &&
    (medicineOrType?.pricingType ===
      "strip" ||
      medicineOrType?.pricingType ===
        "unit")
  ) {
    return medicineOrType.pricingType;
  }

  return STRIP_MEDICINE_TYPES.includes(
    type,
  )
    ? "strip"
    : "unit";
}

/*
 * ============================================================
 * STRIP MEDICINE USAGE
 * ============================================================
 */

export function getDailyMedicinePieces(
  dosage = [],
) {
  if (!Array.isArray(dosage)) {
    return 0;
  }

  return dosage.reduce(
    (total, item) => {
      const quantity = Number(
        item?.quantity,
      );

      if (
        !Number.isFinite(quantity) ||
        quantity <= 0
      ) {
        return total;
      }

      return total + quantity;
    },
    0,
  );
}

export function getMonthlyMedicinePieces(
  dosage = [],
  daysPerMonth = DAYS_PER_MONTH,
) {
  const dailyPieces =
    getDailyMedicinePieces(dosage);

  const days = Number(daysPerMonth);

  if (
    !Number.isFinite(days) ||
    days <= 0
  ) {
    return 0;
  }

  return dailyPieces * days;
}

/*
 * ============================================================
 * STRIP MEDICINE PRICE
 * ============================================================
 */

export function getPricePerPiece(
  pricePerStrip,
  piecesPerStrip,
) {
  const price = Number(
    pricePerStrip,
  );

  const pieces = Number(
    piecesPerStrip,
  );

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

export function getStripMedicineMonthlyCost(
  medicine,
  daysPerMonth = DAYS_PER_MONTH,
) {
  if (!medicine) {
    return 0;
  }

  const monthlyPieces =
    getMonthlyMedicinePieces(
      medicine.dosage,
      daysPerMonth,
    );

  const pricePerPiece =
    getPricePerPiece(
      medicine.pricePerStrip,
      medicine.piecesPerStrip,
    );

  return monthlyPieces * pricePerPiece;
}

/*
 * ============================================================
 * UNIT MEDICINE PRICE
 * ============================================================
 */

export function getUnitMedicineMonthlyCost(
  medicine,
) {
  if (!medicine) {
    return 0;
  }

  const pricePerUnit = Number(
    medicine.pricePerUnit,
  );

  const unitsPerMonth = Number(
    medicine.unitsPerMonth,
  );

  if (
    !Number.isFinite(pricePerUnit) ||
    pricePerUnit < 0 ||
    !Number.isFinite(unitsPerMonth) ||
    unitsPerMonth < 0
  ) {
    return 0;
  }

  return (
    pricePerUnit * unitsPerMonth
  );
}

/*
 * ============================================================
 * UNIVERSAL MONTHLY MEDICINE COST
 * ============================================================
 *
 * This should be used anywhere the application needs the
 * monthly cost of one medicine.
 */

export function getMedicineMonthlyCost(
  medicine,
  daysPerMonth = DAYS_PER_MONTH,
) {
  if (!medicine) {
    return 0;
  }

  const pricingType =
    getMedicinePricingType(medicine);

  if (pricingType === "strip") {
    return getStripMedicineMonthlyCost(
      medicine,
      daysPerMonth,
    );
  }

  return getUnitMedicineMonthlyCost(
    medicine,
  );
}

/*
 * ============================================================
 * TOTAL MONTHLY COST
 * ============================================================
 *
 * Only active medicines are included.
 */

export function getTotalMonthlyMedicineCost(
  medicines = [],
  daysPerMonth = DAYS_PER_MONTH,
) {
  if (!Array.isArray(medicines)) {
    return 0;
  }

  return medicines
    .filter(
      (medicine) =>
        medicine?.isActive !== false,
    )
    .reduce(
      (total, medicine) =>
        total +
        getMedicineMonthlyCost(
          medicine,
          daysPerMonth,
        ),
      0,
    );
}

/*
 * ============================================================
 * FORMATTING
 * ============================================================
 */

export function formatMedicinePrice(
  value,
) {
  const price = Number(value);

  if (!Number.isFinite(price)) {
    return "৳0.00";
  }

  return `${price.toFixed(2)}`;
}