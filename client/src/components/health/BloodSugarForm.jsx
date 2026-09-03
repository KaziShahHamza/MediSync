// client/src/components/health/BloodSugarForm.jsx

import { useState } from "react";
import { Droplets, Save } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="ms-card ms-form ms-health-form">
      <div className="ms-health-form-header">
        <div className="ms-icon-box ms-health-form-icon">
          <Droplets size={21} aria-hidden="true" />
        </div>

        <div>
          <span className="ms-health-form-eyebrow">Glucose monitoring</span>

          <h3 className="ms-card-title">Blood Sugar</h3>
        </div>
      </div>

      <div className="ms-field">
        <label htmlFor="blood-sugar-glucose" className="ms-label">
          Blood Glucose
        </label>

        <input
          id="blood-sugar-glucose"
          type="number"
          step="0.1"
          className="ms-input"
          placeholder="Example: 95"
          value={glucose}
          onChange={(e) => setGlucose(e.target.value)}
          required
        />

        <p className="ms-help-text">
          Enter your blood glucose reading in mg/dL.
        </p>
      </div>

      <div className="ms-health-reference">
        <span className="ms-health-reference-label">Reference</span>

        <p>Normal fasting range: 70–99 mg/dL</p>
      </div>

      <button
        type="submit"
        className="ms-btn ms-btn-primary ms-btn-full ms-health-submit"
      >
        <Save size={18} aria-hidden="true" />
        Save Blood Sugar
      </button>
    </form>
  );
}
