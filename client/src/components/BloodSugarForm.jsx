// client/src/components/BloodSugarForm.jsx

import { useMemo, useState } from "react";
import { Droplets, Save } from "lucide-react";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!glucose || !glucoseTiming || !recordedAt) return;

    await onAdd({
      type: "diabetes",
      glucose,
      glucoseTiming,
      recordedAt,
    });

    setGlucose("");
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
          <option value="postMeal">2 Hours After Meal</option>
          <option value="random">Random</option>
        </select>
      </div>

      <div>
        <label>Blood Glucose</label>

        <input
          type="number"
          step="0.1"
          className="input"
          placeholder="Example: 95"
          value={glucose}
          onChange={(e) => setGlucose(e.target.value)}
        />
      </div>

      <p className="text-sm text-slate-500">
        Enter your blood glucose level in mg/dL.
      </p>

      <button type="submit" className="btn-primary w-full">
        <Save size={18} />
        Save Blood Sugar
      </button>
    </form>
  );
}
