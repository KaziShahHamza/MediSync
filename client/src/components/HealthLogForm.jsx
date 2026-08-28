// client/src/components/HealthLogForm.jsx

import { useState } from "react";

export default function HealthLogForm({ onAdd }) {
  const [type, setType] = useState("bp");
  const [form, setForm] = useState({});

  const submit = async (e) => {
    e.preventDefault();
    await onAdd({ type, ...form });
    setForm({});
  };

  return (
    <form
      onSubmit={submit}
      className="card space-y-4"
    >
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="input"
      >
        <option value="bp">Blood Pressure</option>
        <option value="diabetes">Diabetes</option>
      </select>

      {type === "bp" && (
        <div className="space-y-2">
          <input
            placeholder="High BP (Systolic)"
            type="number"
            onChange={(e) => setForm((f) => ({ ...f, High: e.target.value }))}
            className="input"
          />
          <input
            placeholder="Low BP (Diastolic)"
            type="number"
            onChange={(e) => setForm((f) => ({ ...f, Low: e.target.value }))}
            className="input"
          />
        </div>
      )}

      {type === "diabetes" && (
        <input
          placeholder="Glucose Level"
          type="number"
          step="0.1"
          onChange={(e) => setForm((f) => ({ ...f, glucose: e.target.value }))}
          className="input"
        />
      )}

      <button type="submit" className="btn-primary w-full">
        Add Log
      </button>
    </form>
  );
}
