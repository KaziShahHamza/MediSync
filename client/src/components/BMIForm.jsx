import { useMemo, useState } from "react";
import BMIResult from "./BMIResult";

export default function BMIForm({ onAdd }) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const bmi = useMemo(() => {
    if (!height || !weight) return null;

    const h = Number(height) / 100;
    return (Number(weight) / (h * h)).toFixed(1);
  }, [height, weight]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!height || !weight) return;

    await onAdd({
      type: "bmi",
      height: Number(height),
      weight: Number(weight),
      bmi: Number(bmi),
    });

    setHeight("");
    setWeight("");
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className="text-xl font-semibold mb-5">
        BMI Calculator
      </h3>

      <div className="space-y-4">
        <input
          className="input"
          type="number"
          placeholder="Height (cm)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />

        <input
          className="input"
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <BMIResult bmi={bmi} />

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={!bmi}
        >
          Save BMI
        </button>
      </div>
    </form>
  );
}