import { useState } from "react";

export default function BloodPressureForm({ onAdd }) {
  const [high, setHigh] = useState("");
  const [low, setLow] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!high || !low) return;

    await onAdd({
      type: "bp",
      High: high,
      Low: low,
    });

    setHigh("");
    setLow("");
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className="text-xl font-semibold mb-5">
        Blood Pressure
      </h3>

      <div className="space-y-4">
        <input
          type="number"
          className="input"
          placeholder="Systolic (High)"
          value={high}
          onChange={(e) => setHigh(e.target.value)}
        />

        <input
          type="number"
          className="input"
          placeholder="Diastolic (Low)"
          value={low}
          onChange={(e) => setLow(e.target.value)}
        />

        <p className="text-sm text-slate-400">
          Normal: Below 120 / 80 mmHg
        </p>

        <button
          type="submit"
          className="btn-primary w-full"
        >
          Save Blood Pressure
        </button>
      </div>
    </form>
  );
}