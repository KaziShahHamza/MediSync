// client/src/components/health/BloodPressureChart.jsx

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
import { Activity, HeartPulse } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
);

export default function BloodPressureChart({ logs }) {
  const bpLogs = logs.filter((log) => log.type === "bp").slice(-7);

  return (
    <div className="ms-card ms-health-chart-card">
      <div className="ms-health-chart-header">
        <div className="ms-health-chart-title-group">
          <div className="ms-icon-box ms-health-chart-icon">
            <HeartPulse size={20} aria-hidden="true" />
          </div>

          <div>
            <span className="ms-health-chart-eyebrow">Recent readings</span>

            <h3 className="ms-card-title">Blood Pressure History</h3>
          </div>
        </div>

        {bpLogs.length > 0 && (
          <span className="ms-badge ms-health-chart-count">
            Last {bpLogs.length}
          </span>
        )}
      </div>

      {bpLogs.length === 0 ? (
        <div className="ms-empty-state ms-health-chart-empty">
          <div className="ms-health-empty-icon">
            <Activity size={36} aria-hidden="true" />
          </div>

          <h4 className="ms-health-empty-title">No blood pressure records</h4>

          <p className="ms-health-empty-text">
            Add your first blood pressure reading to start tracking your trend.
          </p>
        </div>
      ) : (
        <div className="ms-health-chart">
          <Line
            data={{
              labels: bpLogs.map((log) =>
                new Date(log.createdAt).toLocaleDateString(),
              ),

              datasets: [
                {
                  label: "Systolic",
                  data: bpLogs.map((log) => log.High),
                  borderColor: "#3b82f6",
                  backgroundColor: "var(--ms-primary-soft)",
                  tension: 0.3,
                },
                {
                  label: "Diastolic",
                  data: bpLogs.map((log) => log.Low),
                  borderColor: "#ef4444",
                  backgroundColor: "var(--ms-danger-soft)",
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
