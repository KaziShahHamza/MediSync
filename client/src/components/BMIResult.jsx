export default function BMIResult({ bmi }) {
  if (!bmi) {
    return (
      <div className="mt-6 border-t pt-4">
        <p className="text-slate-400">
          Enter your height and weight.
        </p>

        <p className="text-sm text-slate-400 mt-2">
          Healthy BMI: 18.5 – 24.9
        </p>
      </div>
    );
  }

  let label = "";
  let color = "";

  if (bmi < 18.5) {
    label = "Underweight";
    color = "text-yellow-500";
  } else if (bmi < 25) {
    label = "Normal";
    color = "text-green-600";
  } else if (bmi < 30) {
    label = "Overweight";
    color = "text-yellow-600";
  } else {
    label = "Obese";
    color = "text-red-600";
  }

  return (
    <div className="border-t pt-5">
      <p className="text-slate-500">
        Current BMI
      </p>

      <h2 className={`text-5xl font-bold mt-1 ${color}`}>
        {bmi}
      </h2>

      <p className={`font-semibold mt-2 ${color}`}>
        {label}
      </p>

      <p className="text-sm text-slate-400 mt-4">
        Healthy BMI range: 18.5 – 24.9 kg/m²
      </p>
    </div>
  );
}