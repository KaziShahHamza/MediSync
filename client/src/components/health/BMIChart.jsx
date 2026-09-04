// client/src/components/health/BMIChart.jsx

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { Activity, TrendingUp } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
);

export default function BMIChart({ logs, height }) {
  const weightLogs = logs.filter((log) => log.type === "weight");

  const feet = Number(height?.feet) || 0;
  const inches = Number(height?.inches) || 0;

  const totalInches = feet * 12 + inches;
  const heightMeters = totalInches * 0.0254;

  const bmiData =
    heightMeters > 0
      ? weightLogs.map((log) => ({
          ...log,
          bmi: Number(
            (Number(log.weight) / (heightMeters * heightMeters)).toFixed(1),
          ),
        }))
      : [];

  return (
    <div className="ms-card ms-health-chart-card">
      <div className="ms-health-chart-header">
        <div className="ms-health-chart-title-group">
          <div className="ms-icon-box ms-health-chart-icon">
            <TrendingUp size={20} aria-hidden="true" />
          </div>

          <div>
            <span className="ms-health-chart-eyebrow">Weight-based trend</span>

            <h3 className="ms-card-title">BMI History</h3>
          </div>
        </div>
      </div>

      {!heightMeters ? (
        <div className="ms-empty-state ms-health-chart-empty">
          <div className="ms-health-empty-icon">
            <Activity size={36} aria-hidden="true" />
          </div>

          <h4 className="ms-health-empty-title">Height required</h4>

          <p className="ms-health-empty-text">
            Please add your height in your profile first.
          </p>
        </div>
      ) : bmiData.length === 0 ? (
        <div className="ms-empty-state ms-health-chart-empty">
          <div className="ms-health-empty-icon">
            <Activity size={36} aria-hidden="true" />
          </div>

          <h4 className="ms-health-empty-title">No BMI records yet</h4>

          <p className="ms-health-empty-text">
            Add a weight record to start tracking your BMI history.
          </p>
        </div>
      ) : (
        <div className="ms-health-chart">
          <Line
            data={{
              labels: bmiData.map((log) =>
                new Date(log.createdAt).toLocaleDateString(),
              ),

              datasets: [
                {
                  label: "BMI",
                  data: bmiData.map((log) => log.bmi),
                  borderColor: "#3b82f6",
                  backgroundColor: "var(--ms-primary-soft)",
                  tension: 0.3,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
