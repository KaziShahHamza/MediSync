// client/src/components/health/BloodPressureForm.jsx

// Provides a form for recording systolic and diastolic blood pressure.
// Handles saving state and identifies potentially critical readings.

import { useState } from "react";
import { HeartPulse, Loader2, Save } from "lucide-react";

const CRITICAL_SYSTOLIC = 180;
const CRITICAL_DIASTOLIC = 120;

export default function BloodPressureForm({ onAdd }) {
  const [high, setHigh] = useState("");
  const [low, setLow] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Detect readings that may require emergency notification handling.
  const isCritical =
    Number(high) > CRITICAL_SYSTOLIC || Number(low) > CRITICAL_DIASTOLIC;

  // Validate and submit the blood pressure record.
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!high || !low || isSaving) return;

    setIsSaving(true);

    try {
      await onAdd({
        type: "bp",
        High: high,
        Low: low,
      });

      setHigh("");
      setLow("");
    } catch (error) {
      console.error("Failed to save blood pressure:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Keep the submit button state synchronized with the save operation.
  const submitLabel = isSaving
    ? isCritical
      ? "Emailing emergency contacts..."
      : "Saving blood pressure..."
    : "Save Blood Pressure";

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <div className="flex items-center gap-3">
        <div className="icon-wrapper">
          <HeartPulse size={22} className="text-blue-600" />
        </div>

        <h3 className="card-title">Blood Pressure</h3>
      </div>

      <div>
        <label>Systolic Pressure (High)</label>

        <input
          type="number"
          className="input"
          placeholder="Example: 120"
          value={high}
          onChange={(e) => setHigh(e.target.value)}
        />
      </div>

      <div>
        <label>Diastolic Pressure (Low)</label>

        <input
          type="number"
          className="input"
          placeholder="Example: 80"
          value={low}
          onChange={(e) => setLow(e.target.value)}
        />
      </div>

      <p className="text-sm text-slate-500">
        Normal range: below 120 / 80 mmHg
      </p>

      <button type="submit" className="btn-primary w-full" disabled={isSaving}>
        {isSaving ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {submitLabel}
          </>
        ) : (
          <>
            <Save size={18} />
            {submitLabel}
          </>
        )}
      </button>
    </form>
  );
}
