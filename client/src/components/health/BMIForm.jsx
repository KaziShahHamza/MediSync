// client/src/components/health/BMIForm.jsx

import { useMemo, useState } from "react";
import { Ruler, Save, Scale, Weight } from "lucide-react";
import BMIResult from "./BMIResult";
import { useProfile } from "../../context/ProfileContext";

export default function BMIForm({ onAdd }) {
  const { profile } = useProfile();

  const [weight, setWeight] = useState("");

  const heightCm = useMemo(() => {
    const feet = Number(profile?.height?.feet) || 0;
    const inches = Number(profile?.height?.inches) || 0;

    if (!feet && !inches) return null;

    const totalInches = feet * 12 + inches;

    return totalInches * 2.54;
  }, [profile]);

  const bmi = useMemo(() => {
    if (!heightCm || !weight) return null;

    const heightMeters = heightCm / 100;

    return (Number(weight) / (heightMeters * heightMeters)).toFixed(1);
  }, [heightCm, weight]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!heightCm || !weight) return;

    await onAdd({
      type: "weight",
      weight: Number(weight),
    });

    setWeight("");
  };

  const heightDisplay =
    profile?.height?.feet || profile?.height?.inches
      ? `${profile.height.feet || 0} ft ${profile.height.inches || 0} in`
      : "Height not set";

  return (
    <form onSubmit={handleSubmit} className="ms-card ms-form ms-health-form">
      <div className="ms-health-form-header">
        <div className="ms-icon-box ms-health-form-icon">
          <Scale size={21} aria-hidden="true" />
        </div>

        <div>
          <span className="ms-health-form-eyebrow">Body composition</span>

          <h3 className="ms-card-title">BMI Calculator</h3>
        </div>
      </div>

      {/* Saved Height */}
      <div className="ms-field">
        <label htmlFor="bmi-height" className="ms-label">
          Height
        </label>

        <div
          id="bmi-height"
          className={`ms-health-profile-value ${
            !heightCm ? "ms-health-profile-value-error" : ""
          }`}
        >
          <Ruler
            size={19}
            className="ms-health-profile-icon"
            aria-hidden="true"
          />

          {heightCm ? (
            <div className="ms-health-profile-content">
              <p className="ms-health-profile-main">{heightDisplay}</p>

              <p className="ms-help-text">Retrieved from your profile</p>
            </div>
          ) : (
            <p className="ms-health-profile-error">Height not set</p>
          )}
        </div>

        {!heightCm && (
          <p className="ms-error">
            Please set your height in your profile first.
          </p>
        )}
      </div>

      {/* Weight */}
      <div className="ms-field">
        <label htmlFor="bmi-weight" className="ms-label">
          Weight
        </label>

        <div className="ms-input-with-icon">
          <Weight size={18} className="ms-input-icon" aria-hidden="true" />

          <input
            id="bmi-weight"
            type="number"
            min="1"
            step="0.1"
            className="ms-input ms-input-with-leading-icon"
            placeholder="Weight in kg"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>

        <p className="ms-help-text">Enter your current weight in kilograms.</p>
      </div>

      {/* Result */}
      <div className="ms-health-bmi-result">
        <BMIResult bmi={bmi} />
      </div>

      <button
        type="submit"
        disabled={!bmi || !heightCm}
        className="ms-btn ms-btn-primary ms-btn-full ms-health-submit"
      >
        <Save size={18} aria-hidden="true" />
        Save BMI
      </button>
    </form>
  );
}
