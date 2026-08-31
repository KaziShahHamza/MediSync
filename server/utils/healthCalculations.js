export function calculateBMI(weightKg, height) {
  if (!weightKg || !height?.feet) {
    return null;
  }

  const totalInches =
    height.feet * 12 + (height.inches || 0);

  const heightMeters = totalInches * 0.0254;

  if (!heightMeters) {
    return null;
  }

  const bmi = weightKg / (heightMeters * heightMeters);

  return Number(bmi.toFixed(1));
}

export function getBMICategory(bmi) {
  if (!bmi) return null;

  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Healthy weight";
  if (bmi < 30) return "Overweight";

  return "Obesity";
}