// client/src/components/health/BloodSugarForm.jsx

import { useMemo, useState } from "react";
import { Droplets, Loader2, Save } from "lucide-react";

const CRITICAL_LOW_GLUCOSE = 3.0;
const CRITICAL_HIGH_GLUCOSE = 22.2;

function formatDateLabel(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function BloodSugarForm({ onAdd }) {
  const [glucose, setGlucose] = useState("");
  const [glucoseTiming, setGlucoseTiming] = useState("fasting");
  const [isSaving, setIsSaving] = useState(false);

  const availableDates = useMemo(() => {
    const dates = [];

    for (let offset = 0; offset < 5; offset++) {
      const date = new Date();

      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - offset);

      dates.push({
        value: formatDateValue(date),
        label: formatDateLabel(date),
      });
    }

    return dates;
  }, []);

  const [recordedAt, setRecordedAt] = useState(availableDates[0]?.value || "");

  const numericGlucose = Number(glucose);

  const isCritical =
    glucose &&
    (numericGlucose < CRITICAL_LOW_GLUCOSE ||
      numericGlucose >= CRITICAL_HIGH_GLUCOSE);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!glucose || !glucoseTiming || !recordedAt || isSaving) return;

    setIsSaving(true);

    try {
      await onAdd({
        type: "diabetes",
        glucose,
        glucoseTiming,
        recordedAt,
      });

      setGlucose("");
    } catch (error) {
      console.error("Failed to save blood sugar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <div className="flex items-center gap-3">
        <div className="icon-wrapper">
          <Droplets size={22} className="text-blue-600" />
        </div>

        <h3 className="card-title">Blood Sugar</h3>
      </div>

      <div>
        <label>Measurement Date</label>

        <select
          className="input"
          value={recordedAt}
          onChange={(e) => setRecordedAt(e.target.value)}
        >
          {availableDates.map((date) => (
            <option key={date.value} value={date.value}>
              {date.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Measurement Type</label>

        <select
          className="input"
          value={glucoseTiming}
          onChange={(e) => setGlucoseTiming(e.target.value)}
        >
          <option value="fasting">Fasting</option>
          <option value="random">Before Meal / Random</option>
          <option value="postMeal">2 Hours After Meal</option>
        </select>
      </div>

      <div>
        <label>Blood Glucose</label>

        <input
          type="number"
          step="0.1"
          className="input"
          placeholder="Example: 7.4"
          value={glucose}
          onChange={(e) => setGlucose(e.target.value)}
        />
      </div>

      <p className="text-sm text-slate-500">
        Enter your blood glucose level in mmol/L.
      </p>

      <button type="submit" className="btn-primary w-full" disabled={isSaving}>
        {isSaving ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {isCritical
              ? "Emailing emergency contacts..."
              : "Saving blood sugar..."}
          </>
        ) : (
          <>
            <Save size={18} />
            Save Blood Sugar
          </>
        )}
      </button>
    </form>
  );
}
