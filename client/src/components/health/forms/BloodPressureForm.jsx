// client/src/components/health/BloodPressureForm.jsx

import { useState } from "react";
import { HeartPulse, Loader2, Save } from "lucide-react";

const CRITICAL_SYSTOLIC = 180;
const CRITICAL_DIASTOLIC = 120;

export default function BloodPressureForm({ onAdd }) {
  const [high, setHigh] = useState("");
  const [low, setLow] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isCritical =
    Number(high) > CRITICAL_SYSTOLIC ||
    Number(low) > CRITICAL_DIASTOLIC;

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

      <button
        type="submit"
        className="btn-primary w-full"
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {isCritical
              ? "Emailing emergency contacts..."
              : "Saving blood pressure..."}
          </>
        ) : (
          <>
            <Save size={18} />
            Save Blood Pressure
          </>
        )}
      </button>
    </form>
  );
}