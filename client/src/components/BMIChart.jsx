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

export default function BMIChart({ logs }) {
  const bmiLogs = logs.filter((log) => log.type === "bmi");

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-5">
        BMI History
      </h3>

      {bmiLogs.length === 0 ? (
        <div className="flex items-center justify-center h-72 text-slate-400">
          No BMI records yet.
        </div>
      ) : (
        <Line
          data={{
            labels: bmiLogs.map((log) =>
              new Date(log.createdAt).toLocaleDateString()
            ),
            datasets: [
              {
                label: "BMI",
                data: bmiLogs.map((log) => log.bmi),
                borderColor: "#3b82f6",
                backgroundColor: "#3b82f633",
                tension: 0.3,
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