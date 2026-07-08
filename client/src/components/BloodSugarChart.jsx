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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

export default function BloodSugarChart({ logs }) {
  const sugarLogs = logs.filter((log) => log.type === "diabetes").slice(-7);

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-5">
        Blood Sugar History
      </h3>

      {sugarLogs.length === 0 ? (
        <div className="flex items-center justify-center h-72 text-slate-400">
          No blood sugar records yet.
        </div>
      ) : (
        <Line
          data={{
            labels: sugarLogs.map((log) =>
              new Date(log.createdAt).toLocaleDateString()
            ),
            datasets: [
              {
                label: "Blood Glucose",
                data: sugarLogs.map((log) => log.glucose),
                borderColor: "#22c55e",
                backgroundColor: "#22c55e33",
              },
            ],
          }}
        //   options={{
        //     responsive: true,
        //     maintainAspectRatio: false,
        //   }}
        //   height={300}
        />
      )}
    </div>
  );
}