// client/src/components/health/BMIForm.jsx

import { useMemo, useState } from "react";
import { Scale, Save, Ruler, Weight } from "lucide-react";
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
    <form onSubmit={handleSubmit} className="card space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="icon-wrapper">
          <Scale size={22} className="text-blue-600" />
        </div>

        <h3 className="card-title">BMI Calculator</h3>
      </div>

      {/* Saved Height */}
      <div>
        <label>Height</label>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <Ruler size={20} className="text-slate-400 shrink-0" />

          {heightCm ? (
            <div>
              <p className="text-lg font-semibold text-slate-800">
                {heightDisplay}
              </p>

              <p className="text-xs text-slate-500">
                Retrieved from your profile
              </p>
            </div>
          ) : (
            <p className="text-sm font-medium text-red-500">Height not set</p>
          )}
        </div>

        {!heightCm && (
          <p className="mt-2 text-sm text-red-500">
            Please set your height in your profile first.
          </p>
        )}
      </div>

      {/* Weight */}
      <div>
        <label>Weight</label>

        <div className="relative">
          <Weight
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="number"
            min="1"
            step="0.1"
            className="input !pl-10"
            placeholder="Weight in kg"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
      </div>

      <BMIResult bmi={bmi} />

      <button
        type="submit"
        disabled={!bmi || !heightCm}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save size={18} />
        Save BMI
      </button>
    </form>
  );
}
