// client/src/components/health/BloodPressureForm.jsx

import { useState } from "react";
import { HeartPulse, Save } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="ms-card ms-form ms-health-form">
      <div className="ms-health-form-header">
        <div className="ms-icon-box ms-health-form-icon">
          <HeartPulse size={21} aria-hidden="true" />
        </div>

        <div>
          <span className="ms-health-form-eyebrow">Cardiovascular</span>

          <h3 className="ms-card-title">Blood Pressure</h3>
        </div>
      </div>

      <div className="ms-field">
        <label htmlFor="blood-pressure-systolic" className="ms-label">
          Systolic Pressure
        </label>

        <input
          id="blood-pressure-systolic"
          type="number"
          className="ms-input"
          placeholder="Example: 120"
          value={high}
          onChange={(e) => setHigh(e.target.value)}
          required
        />

        <p className="ms-help-text">
          The upper number in your blood pressure reading.
        </p>
      </div>

      <div className="ms-field">
        <label htmlFor="blood-pressure-diastolic" className="ms-label">
          Diastolic Pressure
        </label>

        <input
          id="blood-pressure-diastolic"
          type="number"
          className="ms-input"
          placeholder="Example: 80"
          value={low}
          onChange={(e) => setLow(e.target.value)}
          required
        />

        <p className="ms-help-text">
          The lower number in your blood pressure reading.
        </p>
      </div>

      <div className="ms-health-reference">
        <span className="ms-health-reference-label">Reference</span>

        <p>Normal range: below 120 / 80 mmHg</p>
      </div>

      <button
        type="submit"
        className="ms-btn ms-btn-primary ms-btn-full ms-health-submit"
      >
        <Save size={18} aria-hidden="true" />
        Save Blood Pressure
      </button>
    </form>
  );
}
