import { useState } from "react";

export default function BloodSugarForm({ onAdd }) {
  const [glucose, setGlucose] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!glucose) return;

    await onAdd({
      type: "diabetes",
      glucose,
    });

    setGlucose("");
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className="text-xl font-semibold mb-5">
        Blood Sugar
      </h3>

      <div className="space-y-4">
        <input
          type="number"
          step="0.1"
          className="input"
          placeholder="Blood Glucose (mg/dL)"
          value={glucose}
          onChange={(e) => setGlucose(e.target.value)}
        />

        <p className="text-sm text-slate-400">
          Normal fasting: 70–99 mg/dL
        </p>

        <button
          type="submit"
          className="btn-primary w-full"
        >
          Save Blood Sugar
        </button>
      </div>
    </form>
  );
}