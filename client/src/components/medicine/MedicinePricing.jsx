// client/src/components/medicine/MedicinePricing.jsx

// Handles strip-based and unit-based medicine pricing inputs.
// Provides live usage, price-per-piece, and monthly cost previews.

import { CircleDollarSign, Package } from "lucide-react";

import {
  getDailyMedicinePieces,
  getMonthlyMedicinePieces,
  getPricePerPiece,
  getMedicineMonthlyCost,
  formatMedicinePrice,
} from "../../utils/medicine/medicineCalculations";

export default function MedicinePricing({
  pricingType,
  pricePerStrip,
  setPricePerStrip,
  piecesPerStrip,
  setPiecesPerStrip,
  pricePerUnit,
  setPricePerUnit,
  unitsPerMonth,
  setUnitsPerMonth,
  dosage,
}) {
  // Determines whether strip-based pricing fields should be displayed.
  const isStrip = pricingType === "strip";

  // Calculates daily and monthly strip-based medicine usage.
  const dailyPieces = getDailyMedicinePieces(dosage);
  const monthlyPieces = getMonthlyMedicinePieces(dosage);

  // Calculates the estimated cost of one individual strip piece.
  const pricePerPiece = getPricePerPiece(pricePerStrip, piecesPerStrip);

  // Builds a normalized preview object for the shared cost utility.
  const previewMedicine = {
    pricingType,
    dosage,
    pricePerStrip,
    piecesPerStrip,
    pricePerUnit,
    unitsPerMonth,
  };

  // Calculates the estimated monthly medicine cost.
  const monthlyCost = getMedicineMonthlyCost(previewMedicine);

  // Renders strip-specific pricing and usage information.
  if (isStrip) {
    return (
      <section className="space-y-4">
        {/* Displays the strip pricing section header. */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Pricing</h3>

          <p className="mt-1 text-sm text-slate-500">
            Enter the strip price and number of pieces in one strip.
          </p>
        </div>

        {/* Collects strip price and pieces-per-strip values. */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="pricePerStrip"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Price per strip
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                ৳
              </span>

              <input
                id="pricePerStrip"
                type="number"
                min="0"
                step="0.01"
                value={pricePerStrip}
                onChange={(event) => setPricePerStrip(event.target.value)}
                placeholder="e.g. 50"
                className="input w-full pl-8"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="piecesPerStrip"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Pieces per strip
            </label>

            <div className="relative">
              <Package
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="piecesPerStrip"
                type="number"
                min="1"
                step="1"
                value={piecesPerStrip}
                onChange={(event) => setPiecesPerStrip(event.target.value)}
                placeholder="e.g. 10"
                className="input w-full pl-9"
              />
            </div>
          </div>
        </div>

        {/* Presents calculated strip usage and monthly cost. */}
        <div className="rounded-xl border border-sky-100 bg-sky-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <CircleDollarSign size={18} className="text-sky-600" />

            <h4 className="text-sm font-semibold text-slate-900">
              Estimated monthly cost
            </h4>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs text-slate-500">Daily usage</p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {dailyPieces} pieces
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Monthly usage</p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {monthlyPieces} pieces
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Price per piece</p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                ৳{pricePerPiece.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-4 border-t border-sky-100 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Estimated monthly cost
              </span>

              <span className="text-lg font-bold text-sky-700">
                ৳{formatMedicinePrice(monthlyCost)}
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Renders unit-based pricing and monthly usage information.
  return (
    <section className="space-y-4">
      {/* Displays the unit pricing section header. */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900">Pricing</h3>

        <p className="mt-1 text-sm text-slate-500">
          Enter the price per unit and estimated monthly usage.
        </p>
      </div>

      {/* Collects unit price and monthly unit usage values. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="pricePerUnit"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Price per unit
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
              ৳
            </span>

            <input
              id="pricePerUnit"
              type="number"
              min="0"
              step="0.01"
              value={pricePerUnit}
              onChange={(event) => setPricePerUnit(event.target.value)}
              placeholder="e.g. 120"
              className="input w-full pl-8"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="unitsPerMonth"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Units per month
          </label>

          <div className="relative">
            <Package
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="unitsPerMonth"
              type="number"
              min="1"
              step="1"
              value={unitsPerMonth}
              onChange={(event) => setUnitsPerMonth(event.target.value)}
              placeholder="e.g. 2"
              className="input w-full pl-9"
            />
          </div>
        </div>
      </div>

      {/* Presents calculated unit usage and monthly cost. */}
      <div className="rounded-xl border border-sky-100 bg-sky-50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <CircleDollarSign size={18} className="text-sky-600" />

          <h4 className="text-sm font-semibold text-slate-900">
            Estimated monthly cost
          </h4>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-500">Monthly usage</p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {Number(unitsPerMonth) > 0 ? Number(unitsPerMonth) : 0} units
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Price per unit</p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              ৳
              {Number(pricePerUnit) > 0
                ? Number(pricePerUnit).toFixed(2)
                : "0.00"}
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-sky-100 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">
              Estimated monthly cost
            </span>

            <span className="text-lg font-bold text-sky-700">
              ৳{formatMedicinePrice(monthlyCost)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
