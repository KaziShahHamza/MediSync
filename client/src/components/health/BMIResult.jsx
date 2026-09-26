// client/src/components/health/BMIResult.jsx

// Displays the calculated BMI value and its corresponding category.
// Shows guidance text when a BMI value has not yet been calculated.

export default function BMIResult({ bmi }) {
  // Show calculation guidance when no BMI value is available.
  if (!bmi) {
    return (
      <div className="border-t border-slate-200 pt-5">
        <p className="text-slate-500">Enter your weight to calculate BMI.</p>

        <p className="text-sm text-slate-400 mt-2">
          Healthy BMI range: 18.5 – 24.9 kg/m²
        </p>
      </div>
    );
  }

  let label = "";
  let color = "text-slate-700";

  // Assign a category and display color based on the BMI value.
  if (bmi < 18.5) {
    label = "Underweight";
    color = "text-amber-600";
  } else if (bmi < 25) {
    label = "Normal";
    color = "text-green-600";
  } else if (bmi < 30) {
    label = "Overweight";
    color = "text-amber-600";
  } else {
    label = "Obese";
    color = "text-red-600";
  }

  // Render the calculated BMI and its category.
  return (
    <div className="border-t border-slate-200 pt-5">
      <p className="text-sm text-slate-500">Current BMI</p>

      <h2 className={`text-5xl font-bold mt-2 ${color}`}>{bmi}</h2>

      <p className={`mt-2 font-semibold ${color}`}>{label}</p>

      <p className="text-sm text-slate-400 mt-4">
        Healthy BMI range: 18.5 – 24.9 kg/m²
      </p>
    </div>
  );
}
