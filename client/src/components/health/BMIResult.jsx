export default function BMIResult({ bmi }) {
  if (!bmi) {
    return (
      <div className="ms-bmi-result ms-bmi-result-empty">
        <p className="ms-bmi-result-message">
          Enter your weight to calculate BMI.
        </p>

        <p className="ms-bmi-result-help">
          Healthy BMI range: 18.5 – 24.9 kg/m²
        </p>
      </div>
    );
  }

  let label = "";
  let statusClass = "ms-bmi-status-neutral";

  if (bmi < 18.5) {
    label = "Underweight";
    statusClass = "ms-bmi-status-warning";
  } else if (bmi < 25) {
    label = "Normal";
    statusClass = "ms-bmi-status-success";
  } else if (bmi < 30) {
    label = "Overweight";
    statusClass = "ms-bmi-status-warning";
  } else {
    label = "Obese";
    statusClass = "ms-bmi-status-danger";
  }

  return (
    <div className={`ms-bmi-result ${statusClass}`}>
      <div className="ms-bmi-result-heading">
        <p className="ms-bmi-result-label">Current BMI</p>

        <span className="ms-bmi-result-status">{label}</span>
      </div>

      <h2 className="ms-bmi-result-value">{bmi}</h2>

      <p className="ms-bmi-result-category">{label}</p>

      <p className="ms-bmi-result-help">Healthy BMI range: 18.5 – 24.9 kg/m²</p>
    </div>
  );
}
