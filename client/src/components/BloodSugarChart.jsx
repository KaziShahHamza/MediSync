// client/src/components/BloodSugarChart.jsx

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
import { Droplets, Activity } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
);

export default function BloodSugarChart({ logs }) {
  const diabetesLogs = logs.filter(
    (log) =>
      log.type === "diabetes" && log.glucose != null && log.glucoseTiming,
  );

  const groupedByDate = {};

  diabetesLogs.forEach((log) => {
    const date = new Date(log.createdAt).toLocaleDateString();

    if (!groupedByDate[date]) {
      groupedByDate[date] = {
        fasting: null,
        postMeal: null,
        random: null,
      };
    }

    groupedByDate[date][log.glucoseTiming] = log.glucose;
  });

  const dates = Object.keys(groupedByDate)
    .sort((a, b) => new Date(a) - new Date(b))
    .slice(-10);

  const chartData = {
    labels: dates,

    datasets: [
      {
        label: "Fasting",
        data: dates.map((date) => groupedByDate[date].fasting),
        borderColor: "#2563EB",
        backgroundColor: "#2563EB33",
        tension: 0.3,
        spanGaps: true,
      },

      {
        label: "2 Hours After Meal",
        data: dates.map((date) => groupedByDate[date].postMeal),
        borderColor: "#16A34A",
        backgroundColor: "#16A34A33",
        tension: 0.3,
        spanGaps: true,
      },

      {
        label: "Random",
        data: dates.map((date) => groupedByDate[date].random),
        borderColor: "#DC2626",
        backgroundColor: "#DC262633",
        tension: 0.3,
        spanGaps: true,
      },
    ],
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <Droplets size={22} className="text-blue-600" />

        <h3 className="card-title">Blood Sugar History</h3>
      </div>

      {dates.length === 0 ? (
        <div className="h-72 flex flex-col items-center justify-center text-center">
          <Activity size={40} className="text-slate-300" />

          <p className="mt-4 text-slate-500">
            No blood sugar records available.
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
