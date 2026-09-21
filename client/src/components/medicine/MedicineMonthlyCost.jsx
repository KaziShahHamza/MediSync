// client/src/components/medicine/MedicineMonthlyCost.jsx

import { CircleDollarSign, TrendingUp } from "lucide-react";
import {
  getTotalMonthlyMedicineCost,
  formatMedicinePrice,
} from "../../utils/medicine/medicineCalculations";

// Displays aggregated monthly estimated costs across active medicines.
export default function MedicineMonthlyCost({ medicines = [] }) {
  // Filters active medicines for count indicator.
  const activeMedicines = medicines.filter(
    (medicine) => medicine?.isActive !== false,
  );

  // Computes grand total monthly cost across provided medicines.
  const totalMonthlyCost = getTotalMonthlyMedicineCost(medicines);

  return (
    // Cost breakdown card banner
    <section className="card mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Card header and descriptive info */}
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-sky-50 p-3">
            <CircleDollarSign className="h-6 w-6 text-sky-600" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Estimated Monthly Medicine Cost
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Based on your active medicines and a 30-day month.
            </p>
          </div>
        </div>

        {/* Formatted total cost display */}
        <div className="flex items-center gap-2 sm:text-right">
          <TrendingUp className="h-5 w-5 text-sky-600" />

          <div>
            <p className="text-2xl font-bold text-slate-800">
              ৳{formatMedicinePrice(totalMonthlyCost)}
            </p>

            <p className="text-xs text-slate-500">
              {activeMedicines.length} active medicine
              {activeMedicines.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}