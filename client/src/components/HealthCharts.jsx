// client/src/components/HealthCharts.jsx

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip);

export default function HealthCharts({ logs }) {
  const bpLogs = logs.filter((l) => l.type === "bp");
  const sugarLogs = logs.filter((l) => l.type === "diabetes");

  return (
    <div className="space-y-6">
      {bpLogs.length > 0 && (
        <div className="p-4  rounded shadow-lg bg-white">
          <h3 className="text-lg font-semibold mb-2">Blood Pressure</h3>
          <Line
            data={{
              labels: bpLogs.map((l) => new Date(l.createdAt).toLocaleDateString()),
              datasets: [
                { label: "Systolic", data: bpLogs.map((l) => l.High), borderColor: "#0ea5e9", backgroundColor: "#0ea5e933" },
                { label: "Diastolic", data: bpLogs.map((l) => l.Low), borderColor: "#f87171", backgroundColor: "#f8717133" }
              ]
            }}
          />
        </div>
      )}

      {sugarLogs.length > 0 && (
        <div className="p-4  rounded shadow-lg bg-white">
          <h3 className="text-lg font-semibold mb-2">Glucose Level</h3>
          <Line
            data={{
              labels: sugarLogs.map((l) => new Date(l.createdAt).toLocaleDateString()),
              datasets: [
                { label: "Glucose", data: sugarLogs.map((l) => l.glucose), borderColor: "#22c55e", backgroundColor: "#22c55e33" }
              ]
            }}
          />
        </div>
      )}
    </div>
  );
}
