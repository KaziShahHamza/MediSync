// client/src/components/health/BloodSugarChart.jsx

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
import { Activity, Droplets } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
);

export default function BloodSugarChart({ logs }) {
  const sugarLogs = logs.filter((log) => log.type === "diabetes").slice(-7);

  return (
    <div className="ms-card ms-health-chart-card">
      <div className="ms-health-chart-header">
        <div className="ms-health-chart-title-group">
          <div className="ms-icon-box ms-health-chart-icon">
            <Droplets size={20} aria-hidden="true" />
          </div>

          <div>
            <span className="ms-health-chart-eyebrow">Recent readings</span>

            <h3 className="ms-card-title">Blood Sugar History</h3>
          </div>
        </div>

        {sugarLogs.length > 0 && (
          <span className="ms-badge ms-health-chart-count">
            Last {sugarLogs.length}
          </span>
        )}
      </div>

      {sugarLogs.length === 0 ? (
        <div className="ms-empty-state ms-health-chart-empty">
          <div className="ms-health-empty-icon">
            <Activity size={36} aria-hidden="true" />
          </div>

          <h4 className="ms-health-empty-title">No blood sugar records</h4>

          <p className="ms-health-empty-text">
            Add your first blood sugar reading to start tracking your trend.
          </p>
        </div>
      ) : (
        <div className="ms-health-chart">
          <Line
            data={{
              labels: sugarLogs.map((log) =>
                new Date(log.createdAt).toLocaleDateString(),
              ),

              datasets: [
                {
                  label: "Blood Glucose",
                  data: sugarLogs.map((log) => log.glucose),
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
