// client/src/components/health/BloodPressureChart.jsx

// Renders the latest blood pressure readings as a line chart.
// Filters blood pressure logs and displays systolic and diastolic values.

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
import { HeartPulse, Activity } from "lucide-react";

// Register the Chart.js components required by the line chart.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
);

export default function BloodPressureChart({ logs }) {
  // Keep only blood pressure records and limit the chart to the latest ten.
  const bpLogs = logs.filter((log) => log.type === "bp").slice(-10);

  // Build chart labels and datasets from the filtered blood pressure records.
  const chartData = {
    labels: bpLogs.map((log) => new Date(log.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: "Systolic",
        data: bpLogs.map((log) => log.High),
        borderColor: "#2563EB",
        backgroundColor: "#2563EB33",
        tension: 0.2,
      },
      {
        label: "Diastolic",
        data: bpLogs.map((log) => log.Low),
        borderColor: "#16A34A",
        backgroundColor: "#16A34A33",
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <HeartPulse size={22} className="text-blue-600" />

        <h3 className="card-title">Blood Pressure Chart (Last 10 Entries)</h3>
      </div>

      {bpLogs.length === 0 ? (
        <div className="h-72 flex flex-col items-center justify-center text-center">
          <Activity size={40} className="text-slate-300" />

          <p className="mt-4 text-slate-500">
            No blood pressure records available.
          </p>
        </div>
      ) : (
        <div className="h-90">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      )}
    </div>
  );
}
