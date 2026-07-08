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

export default function BloodPressureChart({ logs }) {
  const bpLogs = logs.filter((log) => log.type === "bp").slice(-7);

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-5">
        Blood Pressure History
      </h3>

      {bpLogs.length === 0 ? (
        <div className="flex items-center justify-center h-72 text-slate-400">
          No blood pressure records yet.
        </div>
      ) : (
        <Line
          data={{
            labels: bpLogs.map((log) =>
              new Date(log.createdAt).toLocaleDateString()
            ),
            datasets: [
              {
                label: "Systolic",
                data: bpLogs.map((log) => log.High),
                borderColor: "#0ea5e9",
                backgroundColor: "#0ea5e933",
              },
              {
                label: "Diastolic",
                data: bpLogs.map((log) => log.Low),
                borderColor: "#ef4444",
                backgroundColor: "#ef444433",
              },
            ],
          }}
        //   options={{
        //     responsive: true,
        //     maintainAspectRatio: false,
        //   }}
        //   height={200}
        />
      )}
    </div>
  );
}